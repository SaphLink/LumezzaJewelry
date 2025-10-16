import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#edafb8',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#4a5759',
          }}
        >
          L
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

