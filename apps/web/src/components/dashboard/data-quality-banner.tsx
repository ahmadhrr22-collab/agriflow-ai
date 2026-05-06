export function DataQualityBanner() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm"
      style={{background: '#EAF3DE', border: '0.5px solid #C0DD97'}}>
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{background: '#166534'}}></div>
        <span className="font-medium" style={{color: '#27500A'}}>Data pipeline aktif</span>
        <span style={{color: '#3B6D11'}}>·</span>
        <span style={{color: '#3B6D11'}}>
          Sumber: Panel Harga Kementan, BMKG
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span style={{color: '#3B6D11'}}>Confidence score</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{background: '#C0DD97'}}>
            <div className="h-full rounded-full" style={{width: '83%', background: '#166534'}}></div>
          </div>
          <span className="font-medium" style={{color: '#27500A'}}>83%</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{background: '#C0DD97', color: '#27500A'}}>
          Update: 07.00 WIB
        </span>
      </div>
    </div>
  );
}