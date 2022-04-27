export type Latlng = {
  lat: number;
  lng: number;
};

export enum TxState {
  Idle,
  Mining,
  Complete,
  Error,
}
