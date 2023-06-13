#ifndef _ESP8266_H_
#define _ESP8266_H_

#include "HT66F2390.h"

#define REV_OK		0	//接收完成标志
#define REV_WAIT	1	//接收未完成标志

extern char esp8266_buf[128];
extern char *ptrIPD;

void ESP8266_Init(void);

void ESP8266_Clear(void);

_Bool ESP8266_SendCmd(char *cmd, char *res);

void ESP8266_SendData(unsigned char *data, unsigned short len);

_Bool ESP8266_GetIPD(unsigned short timeOut, char *topic);

#endif
