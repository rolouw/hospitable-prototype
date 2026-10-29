import { ReactNode } from 'react'

/** Marks which words of each text are not part of their longest common word sequence */
function wordDiff(a: string[], b: string[]): [boolean[], boolean[]] {
  const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = norm(a[i]) === norm(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const da = new Array<boolean>(m).fill(true)
  const db = new Array<boolean>(n).fill(true)
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (norm(a[i]) === norm(b[j])) {
      da[i] = false
      db[j] = false
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  return [da, db]
}

function render(words: string[], marks: boolean[]): ReactNode[] {
  const out: ReactNode[] = []
  let k = 0
  while (k < words.length) {
    const on = marks[k]
    let end = k
    while (end < words.length && marks[end] === on) end++
    const chunk = words.slice(k, end).join(' ')
    out.push(
      on ? (
        <mark className="diff" key={k} style={{ color: 'inherit' }}>
          {chunk}
        </mark>
      ) : (
        chunk
      ),
    )
    if (end < words.length) out.push(' ')
    k = end
  }
  return out
}

/** Both texts with the words that differ highlighted */
export function highlightDiff(a: string, b: string): [ReactNode[], ReactNode[]] {
  const wa = a.split(/\s+/).filter(Boolean)
  const wb = b.split(/\s+/).filter(Boolean)
  const [da, db] = wordDiff(wa, wb)
  return [render(wa, da), render(wb, db)]
}
