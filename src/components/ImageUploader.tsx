import React, { useState } from 'react'
import { CircularProgress, IconButton, Stack } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/joy'
import { network } from '~/utils/network'

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

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploading(true)

      try {
        const imageUrl = await network.uploadImage(event.target.files[0])
        onChange(imageUrl)
      } finally {
        setUploading(false)
      }
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
        disabled={uploading}
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
