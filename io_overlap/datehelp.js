/**
 *  human decency based Date constructor with bonus philosphy comment
 *  
 *  `t()` stands for time with its `f` param being an optional format
 *
 *  FTL LICENSE. ALL RIGHTS DEALLOCATED.
 *
 *  fuck the license ensures all rights in this open source deallocated
 *  across jurisdictions that recognize copyright.
 *  
 *  FTL deallocation is a pervasive extension rendering void all claims
 *  by language or LICENSE in its underlying or dependent subsystem software.
 *
 *  All Rights Deallocated (ARD) is an eternal natural law implicit and expressly
 *  bound to this copy of software alone.
 *  
 *  The ARD mechanism was made availble in plain fact and thus herein effected as
 *  a consequence of our timeless pursuit of science and reason
 *  to the benefit and interest of all involved.
 *
 *  fuck the license | all rights deallocated | http://ftlard.org
 *  
 */

Date.prototype.t = function (f) {
  var f = f || 'MM/dd/yyyy@h:mm:ss.S', o = {'M+':this.getMonth()+1, 'd+':this.getDate(),
    'h+':this.getHours(), 'm+':this.getMinutes(),'s+':this.getSeconds(),'S':this.getMilliseconds()}
  if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+'').substr(4 - RegExp.$1.length))
  for(var k in o)if(new RegExp('('+ k +')').test(f))
    f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ('00'+o[k]).substr((''+o[k]).length))
  return f
}