export class UnitOfMeasurement 
{
    name: string = "";
    abbreviation: string = "";

    validUnitOfMeasurement()
    {
        if (this.name != null && this.name != undefined && this.name != "" &&
            this.abbreviation != null && this.abbreviation != undefined && this.abbreviation != ""
        )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}