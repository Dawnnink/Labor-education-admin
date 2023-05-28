import React, { useState } from 'react'
import { CircularProgress, IconButton, Stack } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/joy'

const ImageContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${theme.vars.palette.neutral.outlinedBorder}`,
  width: '200px',
  height: '200px',
  overflow: 'hidden',
  borderRadius: theme.radius.md,
}))

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`

export interface ImageUploaderProps {
  width: number
  height: number
  onChange: (image: string | null) => void
  image: string | null
}

export const ImageUploader = ({
  width,
  height,
  onChange,
  image,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploading(true)

      // Here you can add logic to upload the image.
      // For the purpose of this example, we'll simply read it as a data URL.
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target?.result as string)
        setUploading(false)
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  return (
    <ImageContainer
      sx={(theme) => ({
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: theme.vars.palette.background.surface,
      })}
    >
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-button"
        type="file"
        onChange={handleChange}
      />
      <Stack
        htmlFor="upload-button"
        sx={{
          width: '100%',
          height: '100%',
        }}
        component="label"
        alignItems="center"
        justifyContent="center"
      >
        {uploading ? (
          <CircularProgress />
        ) : image ? (
          <>
            <CloseButton
              color="neutral"
              size="sm"
              onClick={(e) => {
                onChange(null)
                e.preventDefault()
              }}
            >
              <CloseIcon fontSize="inherit" />
            </CloseButton>
            <img
              src={image}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </>
        ) : (
          <AddIcon fontSize="large" />
        )}
      </Stack>
    </ImageContainer>
  )
}
