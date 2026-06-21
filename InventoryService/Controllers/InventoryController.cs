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
    


        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = StaticInventory.Items.FirstOrDefault(i => i.Id == id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }


    } 
}
