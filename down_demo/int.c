#include "int.h"
#include "delay.h"
#include "led.h"

void int0_init()
{
	
	_integ = 0b00000010;  // pa1--->int0 --> 下降沿触发
	
	_int0e = 1;
	
	_emi = 1;
}

DEFINE_ISR(int0, 0x04)
{
	_emi = 0;
	
	_ph1 = ~_ph1;
	
	_int0f = 0;
	
	_emi = 1;
}
