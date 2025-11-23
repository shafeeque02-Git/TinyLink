import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRModal({ code, onClose }) {
  const url = `${location.origin}/${code}`
  return (
    <div className="modal active">
      <div className="modal-content" style={{textAlign: 'center'}}>
        <div className="modal-header"><h2>QR Code</h2><button className="close-btn" onClick={onClose}>×</button></div>
        <div className="qr-code-container"><QRCodeCanvas value={url} size={200} /></div>
        <p style={{marginTop: '1rem', color: '#718096'}}>Scan to visit</p>
      </div>
    </div>
  )
}
