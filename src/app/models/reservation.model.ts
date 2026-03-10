export interface ReservationModel {
    id: number,
    userEmail: string,
    toys: {
        toyId: number,
        name: string,
        price: number,
        quantity: number
    }[],
    totalPrice: number,
    status: 'rezervisano' | 'pristiglo' | 'otkazano',
    createdAt: string
}
