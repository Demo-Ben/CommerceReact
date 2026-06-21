using Microsoft.AspNetCore.Mvc;
using InventoryService.Data;

namespace InventoryService.Controllers
{
    [ApiController]
    [Route("inventory")]
    public class InventoryController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(StaticInventory.Items);
        }
    }
}
