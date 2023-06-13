#include "delay.h"

void delay_ms(u16 ms)
{
	while(ms--)
		GCC_DELAY(2000);//主频8Mhz，执行一条指令为0.5us。一条指令周期等于四条机器周期——》 1/8Mhz * 4 = 0.5us
}

void delay_us(u16 us)
{
	while(us--)
		GCC_DELAY(2);
}
