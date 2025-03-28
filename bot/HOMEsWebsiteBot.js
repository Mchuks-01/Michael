async function sendNemoMessage() {
    const input = document.getElementById('userInput').value;
    const responseDiv = document.getElementById('response');
  
    if (!input) {
      responseDiv.innerHTML = '⛔ Please enter a question.';
      return;
    }
  
    responseDiv.innerHTML = '🤖 Thinking...';
  
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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',
          'HTTP-Referer': 'https://homeonlinematheducation.com/',  // Replace this
          'X-Title': 'Home Online Math Education',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-nemo',
          messages: [{ role: 'user', content: input }],
        }),
      });
  
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || '⚠️ No reply.';
      responseDiv.innerHTML = marked.parse(reply);
  
    } catch (error) {
      responseDiv.innerHTML = '❌ Error: ' + error.message;
    }
  }
  