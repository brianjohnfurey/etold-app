(async function(){
  async function fetchText(path){
    const resp = await fetch(path, {cache:'no-cache'});
    if(!resp.ok) throw new Error('Failed to load '+path+' ('+resp.status+')');
    return await resp.text();
  }
  try {
    const manifest = JSON.parse(await fetchText('code/loader-manifest.json'));
    for (const item of manifest) {
      let combined='';
      for (const p of item.files) combined += await fetchText(p);
      window.eval(combined + '
//# sourceURL=' + item.sourceURL.replace(/[^\w./-]/g,'_'));
    }
    window.__etoldLoaded = true;
  } catch (err) {
    console.error('E-TOLD load failure:', err);
    alert('E-TOLD failed to load completely. Please refresh once and try again.');
  }
})();
