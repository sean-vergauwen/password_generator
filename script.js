const passwordDisplay = document.getElementById('password-display');
const copyBtn = document.getElementById('copy-btn');
const copyTooltip = document.getElementById('copy-tooltip');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const strengthText = document.getElementById('strength-text');
const strengthBar = document.getElementById('strength-bar');
const generateBtn = document.getElementById('generate-btn');

const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

// Update length display
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    updateStrength();
});

// Generate password on click
generateBtn.addEventListener('click', () => {
    const length = +lengthSlider.value;
    const hasUpper = uppercaseEl.checked;
    const hasLower = lowercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
        alert('Please select at least one character type.');
        return;
    }

    passwordDisplay.value = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    updateStrength();
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    const password = passwordDisplay.value;
    if (!password) return;

    try {
        await navigator.clipboard.writeText(password);
        showTooltip();
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
});

function generatePassword(lowercase, uppercase, numbers, symbols, length) {
    let generatedPassword = '';
    const typesCount = lowercase + uppercase + numbers + symbols;
    const typesArr = [{ lowercase }, { uppercase }, { numbers }, { symbols }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return '';
    }

    // Ensure at least one of each selected type is included
    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += getRandomChar(funcName);
        });
    }

    // Shuffle the result and slice to requested length
    return generatedPassword
        .split('')
        .sort(() => 0.5 - Math.random())
        .slice(0, length)
        .join('');
}

function getRandomChar(type) {
    const chars = charSets[type];
    return chars[Math.floor(Math.random() * chars.length)];
}

function updateStrength() {
    const length = +lengthSlider.value;
    const hasUpper = uppercaseEl.checked;
    const hasLower = lowercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    const selectedCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    
    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (length >= 16) strength++;
    if (selectedCount >= 2) strength++;
    if (selectedCount >= 4) strength++;

    // UI Updates
    if (strength <= 2) {
        strengthText.textContent = 'Weak';
        strengthText.style.color = 'var(--strength-weak)';
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = 'var(--strength-weak)';
    } else if (strength <= 4) {
        strengthText.textContent = 'Medium';
        strengthText.style.color = 'var(--strength-medium)';
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = 'var(--strength-medium)';
    } else {
        strengthText.textContent = 'Strong';
        strengthText.style.color = 'var(--strength-strong)';
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = 'var(--strength-strong)';
    }
}

function showTooltip() {
    copyTooltip.classList.add('show');
    setTimeout(() => {
        copyTooltip.classList.remove('show');
    }, 2000);
}

// Initial update
updateStrength();

// Background Shapes Generation
function initBackgroundShapes() {
    const bgContainer = document.getElementById('bg-shapes');
    const shapeCount = 5;
    
    // Preset geometric styles based on original look
    const presets = [
        { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }, // Organic square
        { borderRadius: '50%' }, // Circle
        { borderRadius: '10% 90% 10% 90% / 90% 10% 90% 10%' }, // Diamond-ish
        { borderRadius: '40% 60% 40% 60% / 60% 40% 60% 40%' }  // Rounded square
    ];

    for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');
        
        const size = Math.random() * 150 + 100;
        const preset = presets[Math.floor(Math.random() * presets.length)];
        
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 80 + 10}%`;
        shape.style.top = `${Math.random() * 80 + 10}%`;
        shape.style.borderRadius = preset.borderRadius;
        
        // Randomize animation
        shape.style.animationDuration = `${Math.random() * 40 + 40}s`;
        shape.style.animationDelay = `${Math.random() * -60}s`;
        if (Math.random() > 0.5) shape.style.animationDirection = 'reverse';
        
        bgContainer.appendChild(shape);
    }
}

// Generate a default password on load
window.addEventListener('load', () => {
    generateBtn.click();
    initBackgroundShapes();
});

// Update strength when options change
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
    el.addEventListener('change', updateStrength);
});
