export interface CellModel {
     _minesAround: number
    _isShown: boolean
    _isMine: boolean
    _isMarked: boolean
    _htmlStr: string
    _coords: CoordsModel
}

export interface CoordsModel {
    row: number
    col: number
}