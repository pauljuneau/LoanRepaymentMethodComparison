function doFirst() {
      var button = document.getElementById("button");
      button.addEventListener("click", saveInput, false);
    }

    function saveInput() {
      loanAmount = document.getElementById("loanAmount");
      loanAmount = loanAmount.value;

      currentLoanDate = document.getElementById("currentLoanDate");
      currentLoanDate = currentLoanDate.value;

      monthlyPaymentDate = document.getElementById("monthlyPaymentDate");
      monthlyPaymentDate = monthlyPaymentDate.value;
	  
	  
	  yearlyPaymentAmount = document.getElementById("yearlyPaymentAmount");
	  yearlyPaymentAmount = yearlyPaymentAmount.value;
	  
      apr = document.getElementById("apr");
      apr = apr.value;

      timeDuration = document.getElementById("timeDuration");
      timeDuration = timeDuration.value;  

      alert(loanAmount + ", " + currentLoanDate + ", " + monthlyPaymentDate + ", " + yearlyPaymentAmount +", " + apr + ", " + timeDuration);

      //Store
      sessionStorage.loanAmount = loanAmount;
	  loanAmount = sessionStorage.loanAmount;
	  
      sessionStorage.currentLoanDate = currentLoanDate;
	  currentLoanDate = sessionStorage.currentLoanDate;
	  
      sessionStorage.monthlyPaymentDate = monthlyPaymentDate;
	  monthlyPaymentDate = sessionStorage.monthlyPaymentDate;
	  
	  sessionStorage.yearlyPaymentAmount = yearlyPaymentAmount;
	  yearlyPaymentAmount = sessionStorage.yearlyPaymentAmount;
	  
      sessionStorage.apr = apr;
	  apr = sessionStorage.apr;
	  
      sessionStorage.timeDuration = timeDuration;
	  timeDuration = sessionStorage.timeDuration;

	  
	  var t = timeSpanGenerator(currentLoanDate, timeDuration);
	  
	  //var t = test();
	  //console.log(t);
	  
	  loanCalc(timeSpanGenerator(currentLoanDate, timeDuration), apr, loanAmount, yearlyPaymentAmount, monthlyPaymentDate);
			
	  var yDailyTrace = loanCalc(t, apr, loanAmount, yearlyPaymentAmount, monthlyPaymentDate)[0];
	  var yMonthlyTrace = loanCalc(t, apr, loanAmount, yearlyPaymentAmount, monthlyPaymentDate)[1];
	  
	  var dailyTrace = {
		x: t,
		y: yDailyTrace,
		name: 'Daily Payments',
		type: 'scatter'
      };
	  
	  var monthlyTrace = {
		x: t,
		y: yMonthlyTrace,
		name: 'Monthly Payments',
		type: 'scatter'
      };
	  var data = [dailyTrace, monthlyTrace];
	  
      Plotly.newPlot('myDiv', data);
    }

    window.addEventListener("load", doFirst, false);
    
	/*This function is used to generate time span.
	 *The time span (years) is processed from the user. 
	 *It takes the currentLoanDate entered by user 
	 *and generates the time span from there.
	 */
	function timeSpanGenerator(currentLoanDate, timeDuration) {
		/*Acquiring function variables 
		*/
		//console.log(currentLoanDate + ", " + timeDuration);
		var strCurrentLoanDate = currentLoanDate.toString();
		var arrCurrentLoanDate = strCurrentLoanDate.split("-");
		//console.log(arrCurrentLoanDate);
		
		var year = parseInt(arrCurrentLoanDate[0]);
		
		//console.log(year);
		
		//remember: January=0, February=1, and so on
		var month = parseInt(arrCurrentLoanDate[1]) - 1;
		//console.log(month);
		
		var day = parseInt(arrCurrentLoanDate[2]);
		//console.log(day);
		
		var timeDurationYears = parseInt(timeDuration);
		var timeDurationDays =  timeDurationYears * 365;
		//debugging
		//timeDurationDays = 35;
		
		/*Put currentLoanDate as first element in array, 't'. 
		*From the day entered to the last day for calculated timeDurationDays, 
		* generate date and push onto array, 't'. 
		*/		
		var t = [currentLoanDate];
		//console.log(t);
		
		for (var i = 0; i< timeDurationDays; i++) {
			var theDate = new Date(year, month, day);
			theDate.setDate(theDate.getDate() + 1);
			//remember: January=0, February=1, and so on. So add one to month
			var month = theDate.getMonth() +1;
			var day = theDate.getDate();
			var year = theDate.getFullYear();
			newdate = year + "-" + month + "-" + day;
			month--;
			t.push(newdate);
		}
		//console.log(t);
		return t;
	}
	
	function loanCalc(t, apr, loanAmount, yearlyPaymentAmount, monthlyPaymentDate) {
		var apr = Number(apr);
		var loanAmount = Number(loanAmount);
		var yearlyPaymentAmount = Number(yearlyPaymentAmount);
		
		var monthlyPaymentAmount = yearlyPaymentAmount/12;
		var dailyPaymentAmount   = yearlyPaymentAmount/365;
		//let dpr be daily percentage rate 
		var dpr = (apr/100)/365;
		
		var count = 0;
		
		var principalDaily = [loanAmount - dailyPaymentAmount];
		var principalMonthly = 	[loanAmount];
		
		var currentDayFunction = function (t, count) { 
			var currentDay = parseInt(t[count].split("-")[2]);
			return currentDay;
			}
		
		//console.log('principalDaily'+'['+currentDayFunction(t,count)+']: ' + principalDaily[count] + ' principalMonthly'+'['+currentDayFunction(t,count)+']: ' + principalMonthly[count]);
		count++;
		
		
		for(count; count < t.length; count++) {
			if (currentDayFunction(t,count) != monthlyPaymentDate) {
				principalDaily[count] = principalDaily[count - 1] + principalDaily[count - 1]*dpr - dailyPaymentAmount;
				principalMonthly[count] = principalMonthly[count - 1] + principalMonthly[count - 1]*dpr;
			} else {
				principalDaily[count] = principalDaily[count - 1] + principalDaily[count - 1]*dpr - dailyPaymentAmount;
				principalMonthly[count] = principalMonthly[count - 1] + principalMonthly[count - 1]*dpr -monthlyPaymentAmount;
			}
			//console.log('principalDaily'+'['+currentDayFunction(t,count)+']: ' + principalDaily[count] + ' principalMonthly'+'['+currentDayFunction(t,count)+']: ' + principalMonthly[count]);
		}
		
		var y = [principalDaily, principalMonthly];
		
		//console.log(y);
		return y;
	}
