'use strict';

module.exports = function(date) {
  var zodiac = {
    'Capricorn1':{'m':0,'d':20},
    'Aquarius':{'m':1,'d':19},
    'Pisces':{'m':2,'d':20},
    'Aries':{'m':3,'d':20},
    'Taurus':{'m':4,'d':21},
    'Gemini':{'m':5,'d':21},
    'Cancer':{'m':6,'d':22},
    'Leo':{'m':7,'d':22},
    'Virgo':{'m':8,'d':23},
    'Libra':{'m':9,'d':23},
    'Scorpio':{'m':10,'d':22},
    'Sagittarius':{'m':11,'d':21},
    'Capricorn2':{'m':11,'d':31}
  };
  for(let z in zodiac) {
    let endDate = new Date(date.getFullYear(), zodiac[z].m, zodiac[z].d);
    if (date <= endDate) {
      return z.replace(/[0-9]/g, '');
    }
  }
};