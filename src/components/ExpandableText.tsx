import { Box, Link, Stack, Typography, styled } from '@mui/joy'
import { useState } from 'react'

const TruncatedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export interface ExpandableTextProps {
  text: string
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  if (text.length < 16) return <Typography>{text}</Typography>

  return (
    <Box>
      {expanded ? (
        <>
          {text.split('\n').map((line, index) => (
            <Typography key={index}>{line}</Typography>
          ))}
          <Link onClick={handleExpandClick}>收起</Link>
        </>
      ) : (
        <Stack direction="row" alignItems="center">
          <TruncatedText>{text}</TruncatedText>
          <Link onClick={handleExpandClick} sx={{ whiteSpace: 'nowrap' }}>
            更多
          </Link>
        </Stack>
      )}
    </Box>
  )
}
