export enum ActionAdmin
{
    CHANGE_ROLE = "CHANGE_ROLE",
    MOVED       = "MOVED",
    REMOVED     = "REMOVED",
    LICENSE     = "LICENSE"
}

export enum StatusLicense
{
    ACTIVE  = "ACTIVE",
    PAUSED  = "PAUSED",
    REMOVED = "REMOVED"
}

export enum ActionDescp
{
    SET_LICENSE = "Se le otorgó la licencia al usuario", //establecimiento de licencia
    CHG_LICENSE = "Al usuario especificado se le ha cambiado el estatus de su licencia",//cambio de licencia
    DEL_LICENSE = "Al usuario especificado se le ha revocado la licencia, por algún motivo...", //borrado de licencia
    STP_LICENSE = "Al usuario especificado se le ha detenido la licencia por algún motivo..." //pausa de licencia
}