const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const lineNumbers = document.getElementById('lineNumbers');
    let undoStack = [], redoStack = [];

    function insertTag(startTag, endTag) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      const selected = text.substring(start, end);
      const replacement = startTag + selected + endTag;
      editor.setRangeText(replacement, start, end, 'end');
      updatePreview();
    }

    function updatePreview() {
      const markedText = editor.value
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*?)\*/gim, '<i>$1</i>')
        .replace(/__(.*?)__/gim, '<u>$1</u>')
        .replace(/`{3}(.*?)`{3}/gims, '<pre>$1</pre>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n$/gim, '<br />');
      preview.innerHTML = markedText;
      updateLineNumbers();
    }

    function updateLineNumbers() {
      const lines = editor.value.split('\n').length;
      lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
    }

    function syncScroll() {
      preview.scrollTop = editor.scrollTop;
    }

    function setMode(mode) {
      document.getElementById('btn-source').classList.remove('active');
      document.getElementById('btn-preview').classList.remove('active');
      document.getElementById('btn-both').classList.remove('active');
      document.getElementById(`btn-${mode}`).classList.add('active');

      if (mode === 'source') {
        editor.style.display = 'block';
        preview.style.display = 'none';
        editor.style.width = '100%';
      } else if (mode === 'preview') {
        editor.style.display = 'none';
        preview.style.display = 'block';
        preview.style.width = '100%';
      } else {
        editor.style.display = 'block';
        preview.style.display = 'block';
        editor.style.width = '50%';
        preview.style.width = '50%';
      }
    }

    function toUppercase() {
      editor.value = editor.value.toUpperCase();
      updatePreview();
    }

    function toLowercase() {
      editor.value = editor.value.toLowerCase();
      updatePreview();
    }

    function insertDateTime() {
      const now = new Date();
      insertTag(now.toLocaleString(), '');
    }

    function clearEditor() {
      editor.value = '';
      updatePreview();
    }

    function undoEdit() {
      redoStack.push(editor.value);
      if (undoStack.length) {
        editor.value = undoStack.pop();
        updatePreview();
      }
    }

    function redoEdit() {
      if (redoStack.length) {
        undoStack.push(editor.value);
        editor.value = redoStack.pop();
        updatePreview();
      }
    }

    editor.addEventListener('input', () => {
      undoStack.push(editor.value);
    });

    updatePreview();