// Select DOM elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('lineNumbers');

// Load saved content from LocalStorage when the page loads
window.onload = () => {
  const saved = localStorage.getItem('markdown');
  if (saved) {
    editor.value = saved;
    updatePreview();
  }
  updateLineNumbers();
};

// Update the preview pane with parsed markdown (requires marked.js)
function updatePreview() {
  const markdownText = editor.value;
  preview.innerHTML = marked.parse(markdownText);
  localStorage.setItem('markdown', markdownText);
  updateLineNumbers();
}

// Update line numbers based on the number of lines in the editor
function updateLineNumbers() {
  const lines = editor.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// Synchronize vertical scrolling between editor, preview, and line numbers
function syncScroll() {
  // Sync vertical scroll positions for the three elements
  lineNumbers.scrollTop = editor.scrollTop;
  preview.scrollTop = editor.scrollTop;
}

// Insert tags around the selected text in the editor
function insertTag(openTag, closeTag) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.substring(start, end);
  const before = editor.value.substring(0, start);
  const after = editor.value.substring(end);

  editor.value = before + openTag + selected + closeTag + after;
  editor.focus();
  updatePreview();
}

// Convert selected text to UPPERCASE
function toUppercase() {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.substring(start, end).toUpperCase();
  editor.setRangeText(selected, start, end, 'end');
  updatePreview();
}

// Convert selected text to lowercase
function toLowercase() {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.substring(start, end).toLowerCase();
  editor.setRangeText(selected, start, end, 'end');
  updatePreview();
}

// Insert current date and time at the cursor position
function insertDateTime() {
  const now = new Date().toLocaleString();
  insertTag(now, '');
}

// Clear the editor content with a confirmation prompt
function clearEditor() {
  if (confirm('Are you sure you want to clear the editor?')) {
    editor.value = '';
    localStorage.removeItem('markdown');
    updatePreview();
  }
}

// Switch display mode between source, preview, and both
function setMode(mode) {
  const buttons = ['source', 'preview', 'both'];
  buttons.forEach(id => {
    document.getElementById('btn-' + id).classList.remove('active');
  });
  document.getElementById('btn-' + mode).classList.add('active');

  switch (mode) {
    case 'source':
      editor.style.display = 'block';
      preview.style.display = 'none';
      lineNumbers.style.display = 'block';
      break;
    case 'preview':
      editor.style.display = 'none';
      preview.style.display = 'block';
      lineNumbers.style.display = 'none';
      break;
    case 'both':
      editor.style.display = 'block';
      preview.style.display = 'block';
      lineNumbers.style.display = 'block';
      break;
  }
}

// Adjust the editor height to fill the screen considering toolbar and button group heights
function adjustEditorHeight() {
  const toolbar = document.querySelector('.toolbar');
  const buttonGroup = document.querySelector('.button-group');
  const editorWrapper = document.querySelector('.editor-wrapper');

  const toolbarHeight = (toolbar ? toolbar.offsetHeight : 0) + (buttonGroup ? buttonGroup.offsetHeight : 0);
  document.documentElement.style.setProperty('--toolbar-height', toolbarHeight + 'px');
  if (editorWrapper) {
    editorWrapper.style.height = `calc(100vh - ${toolbarHeight}px)`;
  }
}

// Run on page load and window resize to keep editor height updated
window.addEventListener('load', adjustEditorHeight);
window.addEventListener('resize', adjustEditorHeight);
