import { Alert } from '@mui/joy'
import { ApiError } from '~/utils/network'

export const ErrorDisplay = ({ error }: { error?: ApiError | Error }) => {
  return error ? (
    <Alert color="danger">{error.message || '未知错误'}</Alert>
  ) : null
}
