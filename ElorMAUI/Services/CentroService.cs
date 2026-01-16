using ElorMAUI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ElorMAUI.Services
{
    public class CentroService
    {
        public async Task<List<Centro>> GetCentros()
        {
            // Abrir el JSON desde el Resources
            using var stream = await FileSystem.OpenAppPackageFileAsync("EuskadiLatLon.json");
            using var reader = new StreamReader(stream);
            var contents = await reader.ReadToEndAsync();

            // Ignoro mayúsculas y minúsculas en los nombres de las propiedades
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            // Convertir el texto JSON a la clase RootCentros
            var data = JsonSerializer.Deserialize<RootCentros>(contents, options);

            // Deuelvo la lista de centros, si es nulo devuelvo una lista vacía para evitar errores
            return data?.CENTROS ?? new List<Centro>();
        }
    }
}
