class Calculator {
    constructor() {
        this.auth = {
            currentUser: null,
            users: JSON.parse(localStorage.getItem('users') || '{}')
        };
        // only initialise auth UI if the signUpBtn element exists
        if (document.getElementById('signUpBtn')) {
            this.initAuthUI();
        }
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.degRadBtn = document.getElementById('degRadBtn');
        this.buttonGrid = document.getElementById('buttonGrid');
        this.categoryInfo = document.getElementById('categoryInfo');
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.isDegree = true;
        this.lastResult = null;
        this.currentCategory = 'mathematics';

        // Timer properties
        this.timerSeconds = 0;
        this.timerMinutes = 0;
        this.timerHours = 0;
        this.timerRunning = false;
        this.timerInterval = null;
        this.clockInterval = null;

        this.initializeButtons();
    }

    // authentication helpers
    initAuthUI() {
        const up = document.getElementById('signUpBtn');
        const inbtn = document.getElementById('signInBtn');
        const out = document.getElementById('logoutBtn');
        if (!up || !inbtn || !out) return;
        up.onclick = () => this.signUp();
        inbtn.onclick = () => this.signIn();
        out.onclick = () => this.logOut();
        this.updateAuthButtons();
    }

    updateAuthButtons() {
        const { currentUser } = this.auth;
        document.getElementById('signUpBtn').style.display = currentUser ? 'none' : '';
        document.getElementById('signInBtn').style.display = currentUser ? 'none' : '';
        document.getElementById('logoutBtn').style.display = currentUser ? '' : 'none';
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.auth.users));
    }

    signUp() {
        const user = prompt('Enter new username:');
        if (!user) return;
        if (this.auth.users[user]) {
            alert('User already exists');
            return;
        }
        const pass = prompt('Enter password:');
        if (!pass) return;
        this.auth.users[user] = pass;
        this.saveUsers();
        alert('Sign‑up successful');
    }

    signIn() {
        const user = prompt('Username:');
        if (!user || !this.auth.users[user]) {
            alert('Unknown user');
            return;
        }
        const pass = prompt('Password:');
        if (pass !== this.auth.users[user]) {
            alert('Wrong password');
            return;
        }
        this.auth.currentUser = user;
        alert('Signed in as ' + user);
        this.updateAuthButtons();
    }

    logOut() {
        this.auth.currentUser = null;
        this.updateAuthButtons();
        alert('Logged out');
    }

    // Button configurations for each category
    buttonConfigs = {
        mathematics: [
            ['C', 'clear', '⌫', 'deleteLastChar', '±', 'toggleSign', '÷', 'operator'],
            ['×', 'operator'],
            ['x^y', 'function', 'n!', 'function', '+', 'operator'],
            ['7', 'number', '8', 'number', '9', 'number', '1/x', 'function'],
            ['4', 'number', '5', 'number', '6', 'number', '%', 'function'],
            ['1', 'number', '2', 'number', '3', 'number', 'π', 'function'],
            ['0', 'number', '.', 'decimal', '(', 'paren', ')', 'paren'],
            ['=', 'equals']
        ],

        algebra: [
            ['C', 'clear', '⌫', 'deleteLastChar', '±', 'toggleSign', '÷', 'operator'],
            ['sin', 'function', 'cos', 'function', 'tan', 'function', '×', 'operator'],
            ['log', 'function', 'ln', 'function', 'x', 'variable', '−', 'operator'],
            ['y', 'variable', 'z', 'variable', 'a', 'variable', '+', 'operator'],
            ['b', 'variable', 'c', 'variable', 'x²', 'function', 'x³', 'function'],
            ['x^y', 'function', '√x', 'function', '∛x', 'function', '1/x', 'function'],
            ['7', 'number', '8', 'number', '9', 'number', 'e', 'constant'],
            ['4', 'number', '5', 'number', '6', 'number', 'π', 'function'],
            ['1', 'number', '2', 'number', '3', 'number', '.', 'decimal'],
            ['0', 'number', '(', 'paren', ')', 'paren', '=', 'equals']
        ],
        mass: [
            ['kg→g', 'conversion', 'g→kg', 'conversion', 'kg→lb', 'conversion', 'lb→kg', 'conversion'],
            ['g→oz', 'conversion', 'oz→g', 'conversion', 'C', 'clear', '⌫', 'deleteLastChar'],
            ['0', 'number', '.', 'decimal', '=', 'equals']
        ],
        temperature: [
            ['C→F', 'conversion', 'F→C', 'conversion', 'C→K', 'conversion', 'K→C', 'conversion'],
            ['F→K', 'conversion', 'K→F', 'conversion', 'C', 'clear', '⌫', 'deleteLastChar'],
            ['0', 'number', '.', 'decimal', '=', 'equals']
        ],
        length: [
            ['km→m', 'conversion', 'm→km', 'conversion', 'cm→m', 'conversion', 'm→cm', 'conversion'],
            ['mm→cm', 'conversion', 'cm→mm', 'conversion', 'C', 'clear', '⌫', 'deleteLastChar'],
            ['0', 'number', '.', 'decimal', '=', 'equals']
        ],
        power: [
            ['W→kW', 'conversion', 'kW→W', 'conversion', 'hp→W', 'conversion', 'W→hp', 'conversion'],
            ['C', 'clear', '⌫', 'deleteLastChar', '0', 'number', '.', 'decimal', '=', 'equals'],
        ],
        data: [
            ['B→KB', 'conversion', 'KB→B', 'conversion', 'KB→MB', 'conversion', 'MB→KB', 'conversion'],
            ['MB→GB', 'conversion', 'GB→MB', 'conversion', 'C', 'clear', '⌫', 'deleteLastChar'],
            ['0', 'number', '.', 'decimal', '=', 'equals']
        ],
        speed: [
            ['m/s→km/h', 'conversion', 'km/h→m/s', 'conversion', 'C', 'clear', '⌫', 'deleteLastChar'],
            ['0', 'number', '.', 'decimal', '=', 'equals']
        ],
        time: [
            ['C', 'clear', '+1h', 'timeAdd', '+1m', 'timeAdd', '+1s', 'timeAdd'],
            ['-1h', 'timeSub', '-1m', 'timeSub', '-1s', 'timeSub', 'Start', 'timerControl'],
            ['Stop', 'timerControl', 'Reset', 'timerControl', 'Now', 'getTime', '÷', 'operator'],
            ['7', 'number', '8', 'number', '9', 'number', '×', 'operator'],
            ['4', 'number', '5', 'number', '6', 'number', '−', 'operator'],
            ['1', 'number', '2', 'number', '3', 'number', '+', 'operator'],
            ['0', 'number', '.', 'decimal', ':', 'number', '(', 'paren'],
            [')', 'paren', '=', 'equals']
        ]
    }

    switchCategory(category) {
        // Stop clock if running when switching categories
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }

        this.currentCategory = category;
        // reset expansion when switching categories
        if (category !== 'currency') this.currencyExpanded = false;
        this.initializeButtons();
        this.updateCategoryInfo();
        this.updateDisplay();

        // Update active menu button
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // enlarge calculator when currency category is chosen
        const calcEl = document.querySelector('.calculator');
        if (category === 'currency') {
            calcEl.classList.add('large');
        } else {
            calcEl.classList.remove('large');
        }
    }

    updateCategoryInfo() {
        const info = {
            mathematics: 'Mathematics • Basic operations only',
            algebra: 'Algebra • Variables, equations, and algebraic operations',
            mass: 'Mass • Unit conversions between kg, g, lb, oz',
            temperature: 'Temperature • Convert between °C, °F, and K',
            length: 'Length • Distance conversions (km, m, cm, mm)',
            power: 'Power • Between W, kW, and hp',
            data: 'Data • Bytes, KB, MB, GB',
            speed: 'Speed • m/s ↔ km/h conversions',
            currency: 'Currency • Convert between USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, NZD',
            time: 'Time • Timer, stopwatch, and clock functions'
        };
        this.categoryInfo.textContent = info[this.currentCategory];
    }

    initializeButtons() {
        this.buttonGrid.innerHTML = '';
        let config = this.buttonConfigs[this.currentCategory];

        if (this.currentCategory === 'currency') {
            if (!this.currencyExpanded) {
                // initial view: single button to expand
                config = [['Currency', 'label']];
            } else {
                // expanded view: all pair conversions
                const codes = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'NZD'];
                config = [];
                let row = [];
                codes.forEach(from => {
                    codes.forEach(to => {
                        if (from !== to) {
                            row.push(`${from}→${to}`, 'conversion');
                            if (row.length / 2 === 4) {
                                config.push(row);
                                row = [];
                            }
                        }
                    });
                });
                if (row.length) config.push(row);
                config.push(['C', 'clear', '⌫', 'deleteLastChar']);
                config.push(['0', 'number', '.', 'decimal', '=', 'equals']);
            }
        }

        config.forEach(row => {
            for (let i = 0; i < row.length; i += 2) {
                const label = row[i];
                const type = row[i + 1];
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.textContent = label;

                if (type === 'number') {
                    btn.className += ' btn-number';
                    btn.onclick = () => this.addNumber(label);
                } else if (type === 'operator') {
                    btn.className += ' btn-operator';
                    let opSymbol = label;
                    if (label === '÷') opSymbol = '/';
                    else if (label === '×') opSymbol = '*';
                    else if (label === '−') opSymbol = '-';
                    else if (label === '+') opSymbol = '+';
                    btn.onclick = () => this.addOperator(opSymbol);
                } else if (type === 'function') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.insertFunction(label);
                } else if (type === 'clear') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.clear();
                } else if (type === 'deleteLastChar') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.deleteLastChar();
                } else if (type === 'toggleSign') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.toggleSign();
                } else if (type === 'degRad') {
                    btn.className += ' btn-function';
                    btn.id = 'degRadBtn';
                    btn.onclick = () => this.toggleDegRad();
                } else if (type === 'decimal') {
                    btn.className += ' btn-number';
                    btn.onclick = () => this.addDecimal();
                } else if (type === 'paren') {
                    btn.className += ' btn-number';
                    btn.onclick = () => this.addParenthesis(label);
                } else if (type === 'equals') {
                    btn.className += ' btn-equals';
                    btn.style.gridColumn = 'span 4';
                    btn.onclick = () => this.calculate();
                } else if (type === 'variable' || type === 'constant') {
                    btn.className += ' btn-number';
                    btn.onclick = () => this.addNumber(label);
                } else if (type === 'label') {
                    btn.className += ' btn-label';
                    if (this.currentCategory === 'currency' && label === 'Currency') {
                        // clickable to expand
                        btn.disabled = false;
                        btn.style.cursor = 'pointer';
                        btn.style.opacity = '1';
                        btn.onclick = () => {
                            this.currencyExpanded = true;
                            this.initializeButtons();
                        };
                    } else {
                        btn.disabled = true;
                        btn.style.cursor = 'default';
                        btn.style.opacity = '0.6';
                    }
                } else if (type === 'conversion') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.convertUnit(label);
                } else if (type === 'timeAdd') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.addTime(label);
                } else if (type === 'timeSub') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.subtractTime(label);
                } else if (type === 'timerControl') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.timerControl(label);
                } else if (type === 'getTime') {
                    btn.className += ' btn-function';
                    btn.onclick = () => this.getCurrentTime();
                }

                this.buttonGrid.appendChild(btn);
            }
        });
    }

    addNumber(num) {
        if (num === '0' && this.currentInput === '0') return;
        if (num === '.' && this.currentInput.includes('.')) return;
        if (this.currentInput === '0' && num !== '.') {
            this.currentInput = num;
        } else {
            this.currentInput += num;
        }
        this.updateDisplay();
    }

    addDecimal() {
        if (!this.currentInput.includes('.')) {
            if (this.currentInput === '') {
                this.currentInput = '0.';
            } else {
                this.currentInput += '.';
            }
            this.updateDisplay();
        }
    }

    addParenthesis(bracket) {
        this.currentInput += bracket;
        this.updateDisplay();
    }

    addOperator(op) {
        if (this.currentInput === '' && this.lastResult !== null) {
            this.currentInput = this.lastResult.toString();
        }
        if (this.currentInput === '') return;

        if (this.previousInput !== '') {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = op;
        this.currentInput = '';
        this.updateDisplay();
    }

    deleteLastChar() {
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.lastResult = null;
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentInput === '') return;
        if (this.currentInput.charAt(0) === '-') {
            this.currentInput = this.currentInput.slice(1);
        } else {
            this.currentInput = '-' + this.currentInput;
        }
        this.updateDisplay();
    }

    toggleDegRad() {
        this.isDegree = !this.isDegree;
        this.degRadBtn.textContent = this.isDegree ? 'DEG' : 'RAD';
    }

    insertFunction(func) {
        if (func === 'pi' || func === 'π') {
            this.currentInput += Math.PI.toString();
        } else if (func === 'sin') {
            this.currentInput += 'sin(';
        } else if (func === 'cos') {
            this.currentInput += 'cos(';
        } else if (func === 'tan') {
            this.currentInput += 'tan(';
        } else if (func === 'log') {
            this.currentInput += 'log(';
        } else if (func === 'pow' || func === 'x^y') {
            this.currentInput += '^(';
        } else if (func === '1/x') {
            if (this.currentInput !== '') {
                try {
                    const result = 1 / this.evaluateExpression(this.currentInput);
                    this.currentInput = result.toString();
                } catch (e) {
                    this.display.value = 'Error';
                    return;
                }
            }
        } else if (func === 'factorial' || func === 'n!') {
            if (this.currentInput !== '') {
                try {
                    const num = this.evaluateExpression(this.currentInput);
                    const result = this.factorial(num);
                    this.currentInput = result.toString();
                } catch (e) {
                    this.display.value = 'Error';
                    return;
                }
            }
        } else if (func === 'percent' || func === '%') {
            if (this.currentInput !== '') {
                try {
                    const num = this.evaluateExpression(this.currentInput);
                    this.currentInput = (num / 100).toString();
                } catch (e) {
                    this.display.value = 'Error';
                    return;
                }
            }
        } else if (func === 'x²') {
            if (this.currentInput !== '') {
                try {
                    const num = this.evaluateExpression(this.currentInput);
                    this.currentInput = (num * num).toString();
                } catch (e) {
                    this.display.value = 'Error';
                    return;
                }
            }
        } else if (func === 'x³') {
            if (this.currentInput !== '') {
                try {
                    const num = this.evaluateExpression(this.currentInput);
                    this.currentInput = (num * num * num).toString();
                } catch (e) {
                    this.display.value = 'Error';
                    return;
                }
            }
        } else if (func === '∛x') {
            if (this.currentInput !== '') {
                try {
                    const num = this.evaluateExpression(this.currentInput);
                    this.currentInput = Math.cbrt(num).toString();
                } catch (e) {
                    this.display.value = 'Error';
                    return;
                }
            }
        } else if (func === 'r²') {
            this.currentInput += '^2';
        } else if (func === 'e') {
            this.currentInput += Math.E.toString();
        } else if (func.includes('◯') || func.includes('△') || func.includes('▢') || func.includes('⬠') || func.includes('▭')) {
            // Geometry formulas - just add as reference text
            const formulaMap = {
                '◯ r²π': 'πr²',
                '△ ½bh': '½bh',
                '▢ a²': 'a²',
                '⬠ 3√3a²/2': '3√3a²/2',
                '▭ ab': 'ab'
            };
            const formula = formulaMap[func] || func;
            this.currentInput += formula;
        }
        this.updateDisplay();
    }

    convertUnit(conversion) {
        if (this.currentInput === '') return;

        try {
            const value = this.evaluateExpression(this.currentInput);
            let result;

            // Distance conversions
            if (conversion === 'km→m') result = value * 1000;
            else if (conversion === 'm→km') result = value / 1000;
            else if (conversion === 'cm→m') result = value / 100;
            else if (conversion === 'm→cm') result = value * 100;
            else if (conversion === 'mm→cm') result = value / 10;
            else if (conversion === 'cm→mm') result = value * 10;

            // Mass conversions
            else if (conversion === 'kg→g') result = value * 1000;
            else if (conversion === 'g→kg') result = value / 1000;
            else if (conversion === 'kg→lb') result = value * 2.20462;
            else if (conversion === 'lb→kg') result = value / 2.20462;
            else if (conversion === 'g→oz') result = value / 28.3495;
            else if (conversion === 'oz→g') result = value * 28.3495;

            // Time conversions
            else if (conversion === 'h→m') result = value * 60;
            else if (conversion === 'm→h') result = value / 60;
            else if (conversion === 'm→s') result = value * 60;
            else if (conversion === 's→m') result = value / 60;
            else if (conversion === 'min→s') result = value * 60;
            else if (conversion === 's→min') result = value / 60;
            else if (conversion === 's→ms') result = value * 1000;
            else if (conversion === 'ms→s') result = value / 1000;

            // Volume conversions
            else if (conversion === 'L→ml') result = value * 1000;
            else if (conversion === 'ml→L') result = value / 1000;
            else if (conversion === 'L→gal') result = value / 3.78541;
            else if (conversion === 'gal→L') result = value * 3.78541;

            // Power conversions
            else if (conversion === 'W→kW') result = value / 1000;
            else if (conversion === 'kW→W') result = value * 1000;
            else if (conversion === 'hp→W') result = value * 745.7;
            else if (conversion === 'W→hp') result = value / 745.7;

            // Temperature conversions
            else if (conversion === 'C→F') result = (value * 9 / 5) + 32;
            else if (conversion === 'F→C') result = (value - 32) * 5 / 9;
            else if (conversion === 'C→K') result = value + 273.15;
            else if (conversion === 'K→C') result = value - 273.15;
            else if (conversion === 'F→K') result = ((value - 32) * 5 / 9) + 273.15;
            else if (conversion === 'K→F') result = ((value - 273.15) * 9 / 5) + 32;
            // Data conversions (bytes)
            else if (conversion === 'B→KB') result = value / 1024;
            else if (conversion === 'KB→B') result = value * 1024;
            else if (conversion === 'KB→MB') result = value / 1024;
            else if (conversion === 'MB→KB') result = value * 1024;
            else if (conversion === 'MB→GB') result = value / 1024;
            else if (conversion === 'GB→MB') result = value * 1024;

            // Speed conversions
            else if (conversion === 'm/s→km/h') result = value * 3.6;
            else if (conversion === 'km/h→m/s') result = value / 3.6;

            // Currency conversions using a rate map relative to USD
            else if (/^[A-Z]{3}→[A-Z]{3}$/.test(conversion)) {
                const [from, to] = conversion.split('→');
                const rates = {
                    USD: 1, EUR: 0.92, GBP: 0.78, JPY: 110, AUD: 1.5, CAD: 1.3,
                    CHF: 0.91, CNY: 6.8, INR: 82, NZD: 1.6
                };
                if (rates[from] !== undefined && rates[to] !== undefined) {
                    result = value * (rates[to] / rates[from]);
                }
            }
            if (result !== undefined) {
                this.currentInput = result.toString();
                this.updateDisplay();
            }
        } catch (e) {
            this.display.value = 'Error';
        }
    }

    factorial(n) {
        if (n < 0) throw new Error('Factorial of negative number');
        if (n === 0 || n === 1) return 1;
        if (!Number.isInteger(n)) throw new Error('Factorial requires integer');

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    calculate() {
        // if there is no operator but there is some input, evaluate it directly
        if (this.operator === null) {
            if (this.currentInput === '') return;
            try {
                const result = this.evaluateExpression(this.currentInput);
                this.lastResult = result;
                this.currentInput = result.toString();
                this.previousInput = '';
                this.updateDisplay();
            } catch (e) {
                this.display.value = 'Error';
            }
            return;
        }

        if (this.currentInput === '' || this.previousInput === '') {
            return;
        }

        try {
            const prev = this.evaluateExpression(this.previousInput);
            const curr = this.evaluateExpression(this.currentInput);
            let result;

            switch (this.operator) {
                case '+':
                    result = prev + curr;
                    break;
                case '-':
                    result = prev - curr;
                    break;
                case '*':
                    result = prev * curr;
                    break;
                case '/':
                    if (curr === 0) {
                        this.display.value = 'Cannot divide by zero';
                        this.previousInput = '';
                        this.currentInput = '';
                        this.operator = null;
                        return;
                    }
                    result = prev / curr;
                    break;
                default:
                    return;
            }

            this.lastResult = result;
            this.currentInput = result.toString();
            this.previousInput = '';
            this.operator = null;
            this.updateDisplay();
        } catch (e) {
            this.display.value = 'Error';
        }
    }

    evaluateExpression(expr) {
        // strip out stray letters that shouldn't be part of an expression (user reported "gty" showing up)
        let cleaned = expr.replace(/gty/g, '');

        // Replace mathematical functions with JavaScript Math equivalents
        let expression = cleaned
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/\^/g, '**');

        // Convert degrees to radians if needed
        if (this.isDegree) {
            expression = expression.replace(/Math.sin/g, 'this.sinDeg')
                .replace(/Math.cos/g, 'this.cosDeg')
                .replace(/Math.tan/g, 'this.tanDeg');
        }

        try {
            // Use Function constructor to safely evaluate the expression
            // Bind 'this' context so degree functions work correctly
            const result = Function('"use strict"; return (' + expression + ')').call(this);
            return result;
        } catch (e) {
            throw new Error('Invalid expression');
        }
    }

    sinDeg(degrees) {
        return Math.sin(degrees * Math.PI / 180);
    }

    cosDeg(degrees) {
        return Math.cos(degrees * Math.PI / 180);
    }

    tanDeg(degrees) {
        return Math.tan(degrees * Math.PI / 180);
    }

    updateDisplay() {
        if (this.currentInput === '') {
            this.display.value = this.lastResult !== null ? this.lastResult : '0';
        } else {
            this.display.value = this.currentInput;
        }

        // Update history
        if (this.operator !== null) {
            this.history.value = `${this.previousInput} ${this.operator}`;
        } else if (this.previousInput !== '') {
            this.history.value = this.previousInput;
        } else {
            this.history.value = '';
        }
    }

    addTime(unit) {
        if (unit === '+1h') this.timerHours++;
        else if (unit === '+1m') this.timerMinutes++;
        else if (unit === '+1s') this.timerSeconds++;
        this.updateTimerDisplay();
    }

    subtractTime(unit) {
        if (unit === '-1h' && this.timerHours > 0) this.timerHours--;
        else if (unit === '-1m' && this.timerMinutes > 0) this.timerMinutes--;
        else if (unit === '-1s' && this.timerSeconds > 0) this.timerSeconds--;
        this.updateTimerDisplay();
    }

    timerControl(action) {
        if (action === 'Start') this.startTimer();
        else if (action === 'Stop') this.stopTimer();
        else if (action === 'Reset') this.resetTimer();
    }

    startTimer() {
        if (this.timerRunning) return;
        this.timerRunning = true;

        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            if (this.timerSeconds >= 60) {
                this.timerSeconds = 0;
                this.timerMinutes++;
                if (this.timerMinutes >= 60) {
                    this.timerMinutes = 0;
                    this.timerHours++;
                }
            }
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        this.timerRunning = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.stopTimer();
        this.timerHours = 0;
        this.timerMinutes = 0;
        this.timerSeconds = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const h = String(this.timerHours).padStart(2, '0');
        const m = String(this.timerMinutes).padStart(2, '0');
        const s = String(this.timerSeconds).padStart(2, '0');
        this.display.value = `${h}:${m}:${s}`;
    }

    getCurrentTime() {
        // Stop any existing clock interval
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }

        // Update clock immediately
        const updateClock = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            this.display.value = `${h}:${m}:${s}`;
        };

        updateClock();

        // Start ticking clock - update every second
        this.clockInterval = setInterval(updateClock, 1000);
    }
}

// Initialize calculator when page loads
const calculator = new Calculator();
calculator.updateDisplay();

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (/[0-9.]/.test(key)) {
        calculator.addNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        calculator.addOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculator.calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        calculator.deleteLastChar();
    } else if (key === 'Escape') {
        e.preventDefault();
        calculator.clear();
    } else if (key === '(' || key === ')') {
        calculator.addParenthesis(key);
    }
});
