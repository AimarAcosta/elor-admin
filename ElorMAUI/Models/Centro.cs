namespace ElorMAUI.Models
{
    public class RootCentros
    {
        public List<Centro> CENTROS { get; set; }
    }

    public class Centro
    {
        public int CCEN { get; set; }
        public string NOM { get; set; }
        public string DMUNIC { get; set; }
        public string DTERRE { get; set; }
        public string DTITUC { get; set; }
        public string DOMI { get; set; }
        public string EMAIL { get; set; }
        public double LATITUD { get; set; }
        public double LONGITUD { get; set; }
    }
}