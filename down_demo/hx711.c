#include "HX711.h"
#include "delay.h"

int Weight_Maopi = 0;
int Weight_Shiwu = 0;

//****************************************************
//延时函数
//****************************************************
void Delay__hx711_us(void)
{
	asm("nop");
	asm("nop");
}

//****************************************************
//读取HX711
//****************************************************
unsigned long HX711_Read(void)	//增益128
{
	unsigned long count = 0; 
	unsigned char i = 0; 
	SCL_set=0;
	SDA_set = 0;
  	HX711_DOUT=1; 
  	SDA_set = 1;
  	
	Delay__hx711_us();
	
  	HX711_SCK=0; 
  	
  	while(HX711_DOUT); 
  	for(i=0; i<24; i++)
	{ 
	  	HX711_SCK=1; 
	  	count=count<<1; 
		HX711_SCK=0; 
		
	  	if(HX711_DOUT)
			count++; 
	} 
 	HX711_SCK=1; 
    count=count^0x800000;//第25个脉冲下降沿来时，转换数据
	Delay__hx711_us();
	HX711_SCK=0;  
	return(count);
}

void Get_Maopi()
{
	Weight_Maopi = HX711_Read();	
} 

void Get_Weight()
{
	Weight_Shiwu = HX711_Read();
	Weight_Shiwu = Weight_Shiwu - Weight_Maopi;		//获取净重
	if(Weight_Shiwu > 0)			
	{	
		Weight_Shiwu = (int)((float)Weight_Shiwu/GapValue); 	//计算实物的实际重量
	}
	else
	{
		Weight_Shiwu = 0;
	}
}






