import React from 'react'
import LinkTable from '../components/LinkTable'

export default function LinksPage(props) {
  // props: links, createLink, deleteById, updateLink, setQrFor, selected, setSelected, onOpenStats, onVisitLink
  return (
    <div>
      <h2 style={{marginTop:0}}>Your Shortened Links</h2>
      <LinkTable {...props} />
    </div>
  )
}
