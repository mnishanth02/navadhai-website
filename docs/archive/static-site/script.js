(() => {
  const root = document.getElementById('navodhai-redesign');
  if (!root) return;

  const helper = root.querySelector('#enquiry-helper');
  const fallback = root.querySelector('#service-fallback');
  const description = root.querySelector('#service-description');
  const preview = root.querySelector('#message-text');
  const handoff = root.querySelector('#topic-whatsapp');
  const radios = root.querySelectorAll('input[name="topic"]');
  if (!helper || !fallback || !description || !preview || !handoff || radios.length !== 3) return;

  const topics = {
    blouse: {
      name: 'blouse making',
      description: 'Have a reference image? You can share it when you message us.',
    },
    dress: {
      name: 'dress making',
      description: 'Have a date in mind? Include it so timing can be discussed.',
    },
    customisation: {
      name: 'customisation',
      description: 'Ask which customisation options are available for your blouse or dress.',
    },
  };

  function update(animate = false) {
    const selected = root.querySelector('input[name="topic"]:checked');
    const topic = selected && topics[selected.value];
    if (!topic) return;
    const message = `Hi Navodhai, I'd like to enquire about ${topic.name}. Can we discuss my requirements?`;
    description.textContent = topic.description;
    preview.textContent = message;
    handoff.href = 'https://wa.me/917845952592?text=' + encodeURIComponent(message);
    if (animate && typeof preview.animate === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      preview.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    }
  }

  try {
    update();
    radios.forEach((radio) => radio.addEventListener('change', () => update(true)));
    helper.hidden = false;
    fallback.hidden = true;
  } catch {
    helper.hidden = true;
    fallback.hidden = false;
  }
})();
