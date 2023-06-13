#include "delay.h"
#include "key.h"
/**
  * @brief  获取独立按键键码
  * @param  无
  * @retval 按下按键的键码，范围：0~4，无按键按下时返回值为0
  */

void key_init(){
	_pec0 = 1;
	_pec1 = 1;
	_pec2 = 1;
	_pec3 = 1;
	
	_pepu0 = 1;
	_pepu1 = 1;
	_pepu2 = 1;
	_pepu3 = 1;
}


unsigned char Key()
{
	unsigned char KeyNumber=0;
	
	if(_pe0==0){delay_ms(20);while(_pe0==0);delay_ms(20);KeyNumber=1;}
	if(_pe1==0){delay_ms(20);while(_pe1==0);delay_ms(20);KeyNumber=2;}
	if(_pe2==0){delay_ms(20);while(_pe2==0);delay_ms(20);KeyNumber=3;}
	if(_pe3==0){delay_ms(20);while(_pe3==0);delay_ms(20);KeyNumber=4;}
	
	return KeyNumber;
}
