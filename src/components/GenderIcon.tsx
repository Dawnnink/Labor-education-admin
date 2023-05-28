import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import { useTheme } from '@mui/joy'

export const GenderIcon = ({ gender }: { gender: '男' | '女' }) => {
  const theme = useTheme()

  return gender === '男' ? (
    <MaleIcon
      sx={{
        color: theme.palette.primary[400],
      }}
      fontSize="small"
    />
  ) : (
    <FemaleIcon
      sx={{
        color: theme.palette.danger[300],
      }}
      fontSize="small"
    />
  )
}
