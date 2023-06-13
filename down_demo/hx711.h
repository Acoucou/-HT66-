#ifndef __HX711_H__
#define __HX711_H__

#include "HT66F2390.h"

#define GapValue 80

extern int Weight_Maopi;
extern int Weight_Shiwu;

//IO设置
#define HX711_DOUT	_pf2   //  PF2脚为SDA
#define	SDA_set		_pfc2  //  PF2脚输入输出模式控制寄存器
#define	HX711_SCK	_pf3   //  PF3脚为SCL
#define	SCL_set		_pfc3  //  PF3脚输入输出模式控制寄存器

//函数或者变量声明
void Delay__hx711_us(void);
unsigned long HX711_Read(void);
void Get_Maopi();
void Get_Weight();

#endif