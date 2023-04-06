export default function MapIcon({
  color = "white",
  dims = "100%",
  margin = "unset",
}) {
  return (
    <svg
      width={dims}
      height={dims}
      viewBox="0 0 52 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none", margin }}
    >
      <path
        d="M48 14.5022H37.685C38.2144 14.1699 38.716 13.7953 39.185 13.3822C39.8923 12.752 40.462 11.9827 40.8586 11.1224C41.2552 10.2622 41.4702 9.32931 41.49 8.38221C41.5207 7.34034 41.3383 6.30317 40.9541 5.33425C40.5699 4.36532 39.992 3.48503 39.2556 2.74729C38.5193 2.00956 37.6401 1.42992 36.6719 1.04387C35.7037 0.65783 34.6669 0.47351 33.625 0.502206C32.6779 0.522045 31.7451 0.736977 30.8848 1.13357C30.0245 1.53017 29.2552 2.09991 28.625 2.80721C27.4669 4.17382 26.5764 5.74619 26 7.44221C25.4248 5.74745 24.536 4.17598 23.38 2.80971C22.7495 2.10135 21.9795 1.53078 21.1183 1.13373C20.2571 0.73667 19.3231 0.521678 18.375 0.502206C17.3325 0.472139 16.2948 0.65536 15.3256 1.04063C14.3564 1.4259 13.4761 2.00511 12.7387 2.74271C12.0013 3.48032 11.4224 4.36079 11.0375 5.33011C10.6525 6.29943 10.4696 7.33718 10.5 8.37971C10.5198 9.32681 10.7348 10.2597 11.1314 11.1199C11.528 11.9802 12.0977 12.7495 12.805 13.3797C13.2736 13.7934 13.7752 14.168 14.305 14.4997H4C3.54016 14.4997 3.08483 14.5903 2.66003 14.7664C2.23523 14.9424 1.84928 15.2004 1.52424 15.5257C1.19921 15.851 0.941449 16.2371 0.765705 16.662C0.58996 17.087 0.499672 17.5424 0.500001 18.0022V26.0022C0.500001 26.9305 0.86875 27.8207 1.52513 28.4771C2.1815 29.1335 3.07174 29.5022 4 29.5022H4.5V46.0022C4.5 46.9305 4.86875 47.8207 5.52513 48.4771C6.1815 49.1335 7.07174 49.5022 8 49.5022H44C44.9283 49.5022 45.8185 49.1335 46.4749 48.4771C47.1312 47.8207 47.5 46.9305 47.5 46.0022V29.5022H48C48.9283 29.5022 49.8185 29.1335 50.4749 28.4771C51.1312 27.8207 51.5 26.9305 51.5 26.0022V18.0022C51.5 17.0739 51.1312 16.1837 50.4749 15.5273C49.8185 14.871 48.9283 14.5022 48 14.5022ZM27.9425 11.7522C28.505 8.72221 29.515 6.31471 30.865 4.78971C31.2263 4.39101 31.6657 4.07094 32.156 3.84944C32.6464 3.62794 33.177 3.50974 33.715 3.50221H33.8525C34.4745 3.50228 35.0901 3.62712 35.6629 3.86935C36.2358 4.11158 36.7542 4.46628 37.1876 4.91244C37.6209 5.35859 37.9604 5.88715 38.1858 6.46683C38.4112 7.0465 38.5181 7.6655 38.5 8.28721C38.4915 8.82573 38.3721 9.35674 38.1493 9.84708C37.9265 10.3374 37.6051 10.7766 37.205 11.1372C34.525 13.5022 29.98 14.2097 27.585 14.4147C27.6475 13.6922 27.75 12.7722 27.9425 11.7522ZM14.8625 4.86471C15.7351 3.99529 16.9157 3.50561 18.1475 3.50221H18.285C18.8235 3.51069 19.3545 3.63006 19.8449 3.85287C20.3352 4.07568 20.7744 4.39714 21.135 4.79721C23.5 7.47721 24.2075 12.0222 24.4125 14.4172C23.69 14.3547 22.77 14.2472 21.76 14.0597C18.73 13.5022 16.3225 12.4872 14.7975 11.1347C14.3968 10.775 14.0747 10.3364 13.8515 9.84641C13.6282 9.35642 13.5085 8.8256 13.5 8.28721C13.4827 7.6541 13.5947 7.02412 13.8289 6.43569C14.0632 5.84727 14.4148 5.31273 14.8625 4.86471ZM3.5 26.0022V18.0022C3.5 17.8696 3.55268 17.7424 3.64645 17.6487C3.74022 17.5549 3.86739 17.5022 4 17.5022H24.5V26.5022H4C3.86739 26.5022 3.74022 26.4495 3.64645 26.3558C3.55268 26.262 3.5 26.1348 3.5 26.0022ZM7.5 46.0022V29.5022H24.5V46.5022H8C7.86739 46.5022 7.74022 46.4495 7.64645 46.3558C7.55268 46.262 7.5 46.1348 7.5 46.0022ZM44.5 46.0022C44.5 46.1348 44.4473 46.262 44.3536 46.3558C44.2598 46.4495 44.1326 46.5022 44 46.5022H27.5V29.5022H44.5V46.0022ZM48.5 26.0022C48.5 26.1348 48.4473 26.262 48.3536 26.3558C48.2598 26.4495 48.1326 26.5022 48 26.5022H27.5V17.5022H48C48.1326 17.5022 48.2598 17.5549 48.3536 17.6487C48.4473 17.7424 48.5 17.8696 48.5 18.0022V26.0022Z"
        fill={color}
      />
    </svg>
  );
}