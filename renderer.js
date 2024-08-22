document.getElementById('populateKeywords').addEventListener('click', () => {
  const keywordsTextarea = document.getElementById('keywordsTextarea').value.trim();
  const keywords = keywordsTextarea.split('\n').map(keyword => keyword.trim()).filter(Boolean);

  const keywordInputs = document.querySelectorAll('.keyword');

  keywords.forEach((keyword, index) => {
    if (keywordInputs[index]) {
      keywordInputs[index].value = keyword;
    }
  });
});

document.getElementById('runScript').addEventListener('click', async () => {
  const businessName = document.getElementById('businessName').value.trim();
  const keywordInputs = document.querySelectorAll('.keyword');
  const keywords = Array.from(keywordInputs).map(input => input.value.trim()).filter(Boolean);

  if (!businessName || keywords.length === 0) {
    alert('Please enter a business name and at least one keyword.');
    return;
  }

  const formData = { businessName, keywords };
  console.log('Form Data:', formData);

  try {
    const keywordsPos = await window.api.runScript(formData);
    console.log('Keywords Position:', keywordsPos);

    const positionCells = document.querySelectorAll('.position');
    Array.from(positionCells).forEach((cell, index) => {
      cell.textContent = keywords[index] ? (keywordsPos[keywords[index]] || '-') : '';
    });
  } catch (error) {
    console.error('Error running script:', error);
    alert('An error occurred while running the script. Please check the console for details.');
  }
});

document.getElementById('copyPositions').addEventListener('click', () => {
  const positionCells = document.querySelectorAll('.position');
  let results = '';

  Array.from(positionCells).forEach(cell => {
    const position = cell.textContent.trim();
    if (position) {
      results += `${position}\n`;
    }
  });

  // Copy to clipboard
  navigator.clipboard.writeText(results).then(() => {
    alert('Positions copied to clipboard!');
  }).catch(err => {
    console.error('Error copying positions to clipboard:', err);
    alert('Failed to copy positions to clipboard.');
  });
});
