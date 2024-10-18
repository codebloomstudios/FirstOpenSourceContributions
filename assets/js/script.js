function getTextColorForBackground(hex) {
    // Convert hex to RGB
    const rgb = hexToRgb(hex);

    // Calculate the relative luminance of the background color
    const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);

    // Calculate contrast ratios with black and white
    const contrastWithBlack = (luminance + 0.05) / (0 + 0.05);
    const contrastWithWhite = (1 + 0.05) / (luminance + 0.05);

    // Return the color with the higher contrast ratio
    return contrastWithBlack > contrastWithWhite ? "#000000" : "#FFFFFF";
}

// Helper function: Convert hex to RGB
function hexToRgb(hex) {
    let strippedHex = hex.replace("#", "");
    if (strippedHex.length === 3) {
        strippedHex = strippedHex.split("").map(c => c + c).join("");
    }
    const bigint = parseInt(strippedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Helper function: Calculate the relative luminance
function calculateLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function splitNumber(n, total = 100) {
    let parts = [];
    let remaining = total;
    let minAllowed = Math.floor(total / (n * 2));  // Smaller range, prevents large variations
    let maxAllowed = Math.floor(total / n) + minAllowed;

    for (let i = 0; i < n - 1; i++) {
        let part = Math.floor(Math.random() * (maxAllowed - minAllowed + 1)) + minAllowed;
        parts.push(part);
        remaining -= part;
        maxAllowed = Math.floor(remaining / (n - i - 1)) + minAllowed;  // Recalculate maxAllowed
    }

    parts.push(remaining);  // Add the remaining amount to the last part

    return parts;
}
function findFactorsAndPairs(n) {
    const factorPairs = [];

    // Iterate from 1 to Math.sqrt(n)
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {  // If i divides n evenly
            factorPairs.push([i, n / i]);  // Add the factor pair

            // Avoid duplicates for perfect squares
            if (i !== n / i) {
                factorPairs.push([n / i, i]);
            }
        }
    }

    return factorPairs;
}

function findLeastDifferencePair(pairs) {
    let minDiff = Infinity;
    let closestPair = null;

    // Iterate through the pairs to find the one with the smallest difference
    pairs.forEach(([a, b]) => {
        const diff = Math.abs(a - b);
        if (diff < minDiff) {
            minDiff = diff;
            closestPair = [a, b];  // Update the closest pair
        }
    });

    return closestPair;
}

function createContainers(count) {
    let containers = []
    countEven = true
    if (count % 2 != 0 && count != 1) {
        countEven = false
        count = count - 1
    }
    const factorPairs = findFactorsAndPairs(count);
    console.log("Factor pairs of " + count + ":", factorPairs);

    const closestPair = findLeastDifferencePair(factorPairs);
    console.log("Pair with the least difference:", closestPair);


    // Example usage:
    m = Math.min(closestPair[0], closestPair[1]);
    n = Math.max(closestPair[0], closestPair[1])
    for (x = 0; x < m; x++) {
        // if count is odd and we are on the last row
        if (x == m - 1 && countEven == false) {
            const result = splitNumber(n + 1);
            containers.push(result);
            console.log(`Splitting 100 into ${n} parts:`, result);
            console.log(`Sum of parts:`, result.reduce((sum, part) => sum + part, 0));  // Should always be 100
        }
        else {
            const result = splitNumber(n);
            containers.push(result);
            console.log(`Splitting 100 into ${n} parts:`, result);
            console.log(`Sum of parts:`, result.reduce((sum, part) => sum + part, 0));  // Should always be 100
        }
    }

    console.log("Containers");
    console.table(containers)
    return containers;

}


let i = 0
let numberOfContributors = window.contributors.length;
// Function to create rows based on the list of lists
createContainers(numberOfContributors).forEach(numbers => {
    const container = document.createElement('div');
    container.className = 'container';
    const row = document.createElement('div');
    row.className = 'row';


    numbers.forEach(num => {
        const rect = document.createElement('div');
        rect.className = 'rectangle';
        rect.style.width = `${num}%`; // Set width based on the number
    
        // Get the text color based on background color
        const textColor = getTextColorForBackground(window.contributors[i].color);
    
        // Create anchor tag and set its properties
        const link = document.createElement('a');
        link.href = window.contributors[i].social;
        link.innerText = window.contributors[i].name;
        
        // Apply the text color to the link (anchor tag)
        link.style.color = textColor; // Ensure text inside the link uses calculated color
        link.style.textDecoration = 'none'; // Remove underline if any
    
        // Apply the background color and border to the div
        rect.style.backgroundColor = window.contributors[i].color; // Set background color
        rect.style.color = textColor; // Ensure the text color applies to the entire div
        
    
        // Append the link to the div and the div to the row
        rect.appendChild(link);
        row.appendChild(rect);
        i = i + 1;
    });
    
    // row.appendChild(marqueeContent)
    container.appendChild(row);
    document.body.appendChild(container);
});