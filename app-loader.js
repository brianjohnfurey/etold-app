(async function(){
  const loader = document.getElementById('loader');
  const frame = document.getElementById('frame');
  const errBox = document.getElementById('error');

  async function fetchText(path){
    const resp = await fetch(path, { cache: 'no-cache' });
    if(!resp.ok) throw new Error('Failed to load '+path+' ('+resp.status+')');
    return await resp.text();
  }

  try{
    const manifest = JSON.parse(await fetchText('./code/html-manifest.json'));
    let html = '';
    for(const part of manifest.parts){
      html += await fetchText('./code/' + part);
    }
    // exact app, unchanged, loaded into iframe
    frame.srcdoc = html;
    frame.onload = function(){
      loader.style.display = 'none';
      frame.style.display = 'block';
    };
    // fallback in case onload is quirky
    setTimeout(function(){
      if(frame.style.display !== 'block'){
        loader.style.display = 'none';
        frame.style.display = 'block';
      }
    }, 1200);
  }catch(err){
    console.error('E-TOLD bundle load failure:', err);
    errBox.style.display = 'block';
    errBox.textContent = 'E-TOLD failed to load completely. Please refresh once and try again. Details: ' + err.message;
  }
})();