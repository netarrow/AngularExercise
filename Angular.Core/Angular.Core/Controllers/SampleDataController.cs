using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace Angular.Core.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private readonly GlobalHostSignalr _host;

        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        static List<WeatherForecast> inMemoryDb;

        public SampleDataController(GlobalHostSignalr host)
        {
            _host = host;
            if (inMemoryDb == null)
            {
                var rng = new Random();
                inMemoryDb = Enumerable.Range(1, 5).Select(index => new WeatherForecast
                {
                    Id = index,
                    DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                    TemperatureC = rng.Next(-20, 55),
                    Summary = Summaries[rng.Next(Summaries.Length)]
                }).ToList();
            }
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(long), 200)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null)
                return BadRequest("Invalid file");

            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var content = memoryStream.ToArray();

            var writer = System.IO.File.CreateText(file.FileName);
            await writer.WriteAsync(Encoding.UTF8.GetString(content));

            return Ok(file.Length);
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(List<string>), 200)]
        public IActionResult CheckNewPost()
        {
            var todayMinute = DateTime.Now.Minute;

            if (todayMinute % 2 == 0)
            {
                return Ok(new List<string>() {$"New {todayMinute}"});
            }
            else return Ok(new List<string>());
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<WeatherForecast>), 200)]
        public IActionResult WeatherForecasts()
        {
            return Ok(inMemoryDb);
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(WeatherForecast), 200)]
        public IActionResult AddWeatherForecasts([FromBody] WeatherForecast request)
        {
            try
            {
                if (request == null)
                    return BadRequest("forecast to create was null");

                request.Id = inMemoryDb.Max(_ => _.Id) + 1;
                inMemoryDb.Add(request);

                _host.SendToAll($"New forecast added {request.TemperatureC}");
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        [HttpPut("[action]")]
        [ProducesResponseType(typeof(bool), 200)]
        public IActionResult UpdateWeatherForecasts([FromBody] WeatherForecast request)
        {
            try
            {
                if (request == null)
                    return BadRequest("forecast to update was null");

                var forecastToUpdate = inMemoryDb.SingleOrDefault(_=>_.Id == request.Id);

                forecastToUpdate.DateFormatted = request.DateFormatted;
                forecastToUpdate.Summary = request.Summary;
                forecastToUpdate.TemperatureC = request.TemperatureC;


                return Ok(true);
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        public class WeatherRequestCreation
        {
            public WeatherForecast forecast;
        }

        public class WeatherForecast
        {
            public int Id { get; set; }
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public bool Glowing {get; set;}

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
