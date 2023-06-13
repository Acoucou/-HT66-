#include "esp8266.h"
#include "uart.h"
#include "delay.h"
#include "uart1.h"
#include "timer.h"

#include <string.h>

#define ESP8266_WIFI_INFO		"AT+CWJAP=\"iPhone XR\",\"12345678\"\r\n"
#define mqtt_cfg				"AT+MQTTUSERCFG=0,1,\"ClienId\",\"\",\"\",0,0,\"\"\r\n"
#define ESP8266_ONENET_INFO		"AT+MQTTCONN=0,\"111.67.206.242\",1883,1\r\n"

char esp8266_buf[128];
unsigned short esp8266_cnt = 0, esp8266_cntPre = 0;

//	函数名称：	ESP8266_Clear
//	函数功能：	清空缓存
void ESP8266_Clear(void)
{
	memset(esp8266_buf,'\0', sizeof(esp8266_buf));
	esp8266_cnt = 0;
}

//	函数名称：	ESP8266_WaitRecive
//	函数功能：	等待接收完成
//	返回参数：	REV_OK-接收完成		REV_WAIT-接收超时未完成
//	说明：		循环调用检测是否接收完成
_Bool ESP8266_WaitRecive(void)
{
	if(strlen(esp8266_buf) != 0)
		return REV_OK;
	
	return REV_WAIT;								//返回接收未完成标志
}

//	函数名称：	ESP8266_SendCmd
//	函数功能：	发送命令
//	入口参数：	cmd：命令
//				res：需要检查的返回指令
//	返回参数：	0-成功	1-失败
_Bool ESP8266_SendCmd(char *cmd, char *res)
{
	unsigned char timeOut = 200;

	send_buff(cmd);
	
	while(timeOut--)
	{
		if(ESP8266_WaitRecive() == REV_OK)							//如果收到数据
		{
			if(strlen(strstr(esp8266_buf, res)) != 0)		//如果检索到关键词
			{
				ESP8266_Clear();									//清空缓存
				
				return 0;
			}
		}
		
		delay_ms(10);
	}
	return 1;
}


//	函数名称：	ESP8266_GetIPD
//	函数功能：	获取平台返回的数据
//	入口参数：	等待的时间(乘以10ms)
//	返回参数：	平台返回的原始数据
//	说明：		不同网络设备返回的格式不同，需要去调试
char *ptrIPD = '\0';
_Bool ESP8266_GetIPD(unsigned short timeOut, char *topic)
{
	do
	{
		if(ESP8266_WaitRecive() == REV_OK)								//如果接收完成
		{
			ptrIPD = strstr((char *)esp8266_buf, topic);				//搜索“msg”头
			if(strlen(ptrIPD) == 0)											//如果没找到，可能是msg头的延迟，还是需要等待一会，但不会超过设定的时间
			{
				return 0;
			}
			else
			{
				ptrIPD = strchr(ptrIPD, ',');							//找到':'
				ptrIPD++;
				ptrIPD = strchr(ptrIPD, ',');							//找到':'
				if(strlen(ptrIPD) != 0)
				{
					ptrIPD++;
					return 1;
				}
			}
		}
		
		delay_ms(5);													//延时等待
	} while(timeOut--);
	
	return 0;														//超时还未找到，返回空指针
}

//	函数名称：	ESP8266_Init
//	函数功能：	初始化ESP8266
void ESP8266_Init(void)
{
	ESP8266_Clear();
	
	while(ESP8266_SendCmd("AT\r\n", "OK"))
		delay_ms(500);

/*	send1_buff("AT\r\n");*/

	while(ESP8266_SendCmd("AT+CWMODE=1\r\n", "OK"))
		delay_ms(500);
/*	send1_buff("AT+CWMODE=1\r\n");*/

	while(ESP8266_SendCmd(ESP8266_WIFI_INFO, "GOT IP"))
		delay_ms(500);
/*	send1_buff("AT+CWJAP\r\n");*/

	while(ESP8266_SendCmd(mqtt_cfg, "OK"))
		delay_ms(500);
/*	send1_buff("AT+MQTTUSERCFG\r\n");*/

	while(ESP8266_SendCmd(ESP8266_ONENET_INFO, "CONNECT"))
		delay_ms(500);
/*	send1_buff("AT+MQTTCONN\r\n");*/

	while(ESP8266_SendCmd("AT+MQTTSUB=0,\"down_time\",1\r\n", "OK"))
		delay_ms(500);
		
	while(ESP8266_SendCmd("AT+MQTTSUB=0,\"water_time\",1\r\n", "OK"))
		delay_ms(500);
		
	while(ESP8266_SendCmd("AT+MQTTSUB=0,\"connectState\",1\r\n", "OK"))
		delay_ms(500);
	
	while(ESP8266_SendCmd("AT+MQTTSUB=0,\"music\",1\r\n", "OK"))
		delay_ms(500);
		
	ESP8266_SendCmd("AT+MQTTPUB=0,\"connectState\",\"true\",1,0\r\n", "OK"); // 上传云端
/*	send1_buff("-------->>esp init ok! welcome to use! <-----\r\n");*/
	
	ESP8266_Clear();
}

// 串口0接收中断
DEFINE_ISR(UART0,0x3C)
{
	_emi=0;
		
	get_buff(esp8266_buf, '\n'); 
	
	_ur0f = 0;
	_emi=1;				
}

