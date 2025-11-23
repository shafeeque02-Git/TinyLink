import { useEffect } from 'react'

// useClickOutside(ref, { onClickOutside, onEscape })
export default function useClickOutside(ref, { onClickOutside, onEscape } = {}) {
  useEffect(() => {
    function handleDown(e) {
      const el = ref && ref.current
      if (!el) return
      if (!el.contains(e.target)) {
        if (onClickOutside) onClickOutside(e)
      }
    }

    function handleKey(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (onEscape) onEscape(e)
      }
    }

    document.addEventListener('mousedown', handleDown)
    document.addEventListener('touchstart', handleDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleDown)
      document.removeEventListener('touchstart', handleDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [ref, onClickOutside, onEscape])
}
