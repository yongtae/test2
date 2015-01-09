﻿/*
 * *****
 * WRITTEN BY FLORIAN RAPPL, 2012.
 * florian-rappl.de
 * mail@florian-rappl.de
 * *****
 */
 
/* LEVELS ORIGINALLY BY
 *
 *
 *        MARTIN BUCHNER
 *               &
 *         PATRICK SAAR
 *
 *
 */

/* FORMAT OF A LEVEL FOR JSON SERIALIZATION:
	{
		height: int,
		width: int,
		data: array[array],
		id: int,
		background: int
	}
*/

var definedLevels = [
{
	width: 252,
	height: 15,
	id: 0,
	background: 1,
	data:
	[
	['grass_top' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , ''],
	['' , 'grass_top' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , ''],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'mario' , '' , ''],
	['' , '' , 'grass_top' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , ''],
	['' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , ''],
	['' , '' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , '' , '' , '' , '' , ''],
	['' , '' , '' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , '' , '' , '' , ''],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'ballmonster' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , 'ballmonster' , '' , ''],
	['' , '' , '' , '' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , 'ballmonster' , '' , ''],
	['' , '' , '' , '' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , 'ballmonster' , '' , ''],
	['' , '' , '' , '' , '' , '' , 'grass_top' , '' , '' , '' , '' , '' , 'ballmonster' , '' , ''],
	/*
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	['' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , '' , 'grass_top' , 'soil'],
	*/
	]
},

];
