
/***************BUDGETCONTROLLER***********************/
var budgetControll = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.persent = -1;
    };

    Expense.prototype.sentPersCalcu = function(totalIncome) {
        if(totalIncome > 0) {
            this.persent = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.persent = -1;
        }
    };

    Expense.prototype.sendPersent = function() {
        return this.persent;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var totalCalc = function(type) {
        sum = 0;
        dataStore.allData[type].forEach(function(current) {
            sum += current.value; // => init = 0 after each one iteration + the value  
        });
        dataStore.total[type] = sum;    
    };

    ///data structure for all
    var dataStore = {
        allData: {
            inc: [],
            exp: []
        },
        total: {
            inc: 0,
            exp: 0
        },
        budge : 0,
        persent : -1
    };

    return {
        addingItems : function(type, desc, valu) {
          var newItems, ID;

            //create new ID
            if(dataStore.allData[type].length > 0) {
               ID = dataStore.allData[type][dataStore.allData[type].length - 1].id + 1;
            } else {
               ID = 0;
            }
 
            //create new item exp or inc
            if (type === 'exp') {
                newItems = new Expense(ID, desc, valu);
            } else if (type === 'inc') {
                newItems = new Income(ID, desc, valu);
            }

            // push to data structure
            dataStore.allData[type].push(newItems);

            //return to the new element as we want
            return newItems
        },

        removeItems : function (type, id) {
            var ids, index;
            ids = dataStore.allData[type].map(function(current){
                return current.id
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                dataStore.allData[type].splice(index, 1);
            }
        },

        calcBudget : function() {
            // calculate the totla income and expense
            totalCalc('inc');    
            totalCalc('exp');    

            // calculate the budget : income - expenseve
            dataStore.budge = dataStore.total.inc - dataStore.total.exp;

            // calculate the persentage of income that we spent
            if(dataStore.total.inc > 0) {
            dataStore.persent = Math.round((dataStore.total.exp / dataStore.total.inc) * 100);
            } else {
                dataStore.persent = -1;
            }
        },

        calcPersenrt : function () {
            dataStore.allData.exp.forEach(function(cur) {
                cur.sentPersCalcu(dataStore.total.inc);
            });
        },

        sendPersent : function() {
            var totalPerse = dataStore.allData.exp.map(function(cur) {
                return cur.sendPersent();
            });
            return totalPerse;
        },
        
        
        budgetSender : function() {
            return {
                budget : dataStore.budge,
                totalInc : dataStore.total.inc,
                totalExp : dataStore.total.exp,
                persent: dataStore.persent,
            }
        },
        

        test: function() {
            console.log(dataStore);
        }
    };



})();


/***************  UI CONTROLLER***********************/

var UIcontroller = (function() {

    var HTMLclasses = {
        inClassType : '.add__type',
        inClassDescri : '.add__description',
        inClassValue : '.add__value',
        inClassBtnadd : '.add__btn',
        incomeListHTML: '.income__list',
        expenseListHTML: '.expenses__title',
     ///output
        outBudget: '.budget__value',
        outIncome: '.budget__income--value',
        outExp: '.budget__expenses--value',
        outExptotalPersent: '.budget__expenses--percentage',
        outExpPers: '.item__percentage',
     ///event bubbling
        parentContainer: '.container',

        OutMonthDisp: '.budget__title--month'

    };
    var formatNumber = function(num, type) {

        var num, int, dec, numSplit;

        num = Math.abs(num); // => + or -
        num = num.toFixed(2); // 200 => 200.00

        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // 25000 => 25, 000
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for(var i =0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        inputValueReader: function () {
            return {
            type: document.querySelector(HTMLclasses.inClassType).value, // exp or inc
            description: document.querySelector(HTMLclasses.inClassDescri).value,
            value: parseFloat(document.querySelector(HTMLclasses.inClassValue).value)
            };
        },


        ListoHtml: function(obj, type) {
            var html, newHtml, elementPick;
         ////create HTML for list of Place holder   
            if(type === 'inc') {
                elementPick = HTMLclasses.incomeListHTML;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                elementPick = HTMLclasses.expenseListHTML;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            }
         ////replace the place holder text        
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

         //// insert html into dom
            document.querySelector(elementPick).insertAdjacentHTML('beforeend', newHtml);   

        },

        removeListItem : function (selectID) {

            var el = document.getElementById(selectID);
            
            el.parentNode.removeChild(el);
        },

        inputFieldClear : function() {
            var fieldsList, fieldsArray;

                // seleect the description and value box
                fieldsList = document.querySelectorAll(HTMLclasses.inClassDescri + ' , ' + HTMLclasses.inClassValue);
                
                // convet list to array
                fieldsArray = Array.prototype.slice.call(fieldsList);

                // clear the filed for current box if maybe value box
                fieldsArray.forEach(function(current, index, array) {
                    current.value = "";
                });

                // focus to input description on each time
                fieldsArray[0].focus();
        },

        budgetOutput: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(HTMLclasses.outBudget).textContent =  formatNumber(obj.budget, type);   
            document.querySelector(HTMLclasses.outIncome).textContent =  formatNumber(obj.totalInc, 'inc');   
            document.querySelector(HTMLclasses.outExp).textContent =  formatNumber(obj.totalExp), 'exp';

            if(obj.persent > 0) {
                document.querySelector(HTMLclasses.outExptotalPersent).textContent =  obj.persent + '%';   
            } else {
                document.querySelector(HTMLclasses.outExptotalPersent).textContent =  'Nill';   
            }

        }, 

        displayUpdatePer: function(percentage) {
            var perFiled = document.querySelectorAll(HTMLclasses.outExpPers);

            nodeListForEach(perFiled, function(current, index) {
                if(percentage[0] > 0) {
                    current.textContent = percentage[index] + '%';
                } else {
                    current.textContent = 'nill';
                }
            });
        },

        displayDate : function () {
             var now, month, months, year;
            now = new Date();

            months = ['Janary', 'Febrary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'Octobar', 'November', 'December'];
            
            month = now.getMonth();

            year = now.getFullYear();

            document.querySelector(HTMLclasses.OutMonthDisp).textContent = months[month] + ' ' + year;
      
        },

        changeBoxColor : function()  {

            var fields = document.querySelectorAll(HTMLclasses.inClassType + ',' + HTMLclasses.inClassDescri + ',' + 
            HTMLclasses.inClassValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(HTMLclasses.inClassBtnadd).classList.toggle('red');
        },


        // Html class shown buplic
        ClassSender: function() {
            return HTMLclasses;
        }
    };

})();


/*************** TOTAL CONTROLLER***********************/

var controller = (function(budCtrl, uiCtrl) {
    
    var setupEventListner = function() {

       // get input value from UIcontroller
        var ClassGetter = uiCtrl.ClassSender();

       // button click event(button event)
        document.querySelector(ClassGetter.inClassBtnadd).addEventListener('click', ctrlAddItem);

       // enter key click event(Enterkey event)
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
               ctrlAddItem();
            }
        });

        document.querySelector(ClassGetter.parentContainer).addEventListener('click', ctrlRmvItem);

        // Change the input field color

        document.querySelector(ClassGetter.inClassType).addEventListener('change', uiCtrl.changeBoxColor);

    };

    var updateBudgetList = function () {
        var budReciver;

        /// 1.Calculate the budget
        budCtrl.calcBudget();    

        /// 2.Return the budget
        budReciver =  budCtrl.budgetSender();

        /// 3.Display the budget on the UI
        uiCtrl.budgetOutput(budReciver);
    };

    var updatePercent = function () {

        /// 1.calculate the persentage
        budCtrl.calcPersenrt();

        /// 2.Read the percentage from the budget controller
        var persent = budCtrl.sendPersent();

        /// 3.Update the UI with new Percentage
        uiCtrl.displayUpdatePer(persent);
    };

    var ctrlAddItem = function() {
        var inputGetter, dataSender;

        /// 1. Get the  field input data 
        inputGetter = uiCtrl.inputValueReader();

        if (inputGetter.description !== "" && inputGetter.value > 0 && !isNaN(inputGetter.value)) {
            /// 2. Add the item to the budget Controller
            dataSender = budCtrl.addingItems(inputGetter.type, inputGetter.description, inputGetter.value);
   
            /// 3. Add the item to the UI
            uiCtrl.ListoHtml(dataSender, inputGetter.type);

            /// 4.clear the input fields
            uiCtrl.inputFieldClear();

            /// 5.call the bugdget updates
            updateBudgetList();

            /// 6.Upadte the persentage   
            updatePercent();
        }

    }; 

    var ctrlRmvItem = function(event) {

        var itemId, splitId, type, ID;

            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

            if(itemId) {
                //isolate the variable use split methode
                splitId = itemId.split('-');
                type = splitId[0];
                ID = parseInt(splitId[1]);
                

             // 1.delete the item from data stucture
                budCtrl.removeItems(type, ID);   

             // 2. Delele item from DOM string
                uiCtrl.removeListItem(itemId);

             // 3. UPdate and show new Budget
                updateBudgetList();

             // 4.Upadte the persentage   
                updatePercent();
            }
    };

    /// returning the eventlistner function to controller
    return {
        init : function() {
            setupEventListner();
            uiCtrl.displayDate();
            uiCtrl.budgetOutput({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                persent: -1 
            });
            console.log('app has been started');
            } 
    };

})(budgetControll, UIcontroller);


// controller called
controller.init();