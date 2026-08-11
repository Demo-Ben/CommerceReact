using Microsoft.AspNetCore.Mvc;
using InventoryService.Data;

namespace InventoryService.Controllers
{
    [ApiController]
    [Route("inventory")]
    public class InventoryController : ControllerBase
    {
        // DTO for reduce stock
        public class ReduceStockDto
        {
            public int Quantity { get; set; }
        }

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

        // POST /inventory/{id}/reduce
        [HttpPost("{id}/reduce")]
        public IActionResult ReduceStock(int id, [FromBody] ReduceStockDto dto)
        {
            var item = StaticInventory.Items.FirstOrDefault(i => i.Id == id);
            if (item == null)
                return NotFound();

            if (dto == null || dto.Quantity <= 0)
                return BadRequest("Invalid quantity");

            if (item.Stock < dto.Quantity)
                return BadRequest("Insufficient stock");

            item.Stock -= dto.Quantity;

            return Ok(item);
        }

        // POST /inventory/{id}/increase
        [HttpPost("{id}/increase")]
        public IActionResult IncreaseStock(int id, [FromBody] ReduceStockDto dto)
        {
            var item = StaticInventory.Items.FirstOrDefault(i => i.Id == id);
            if (item == null)
                return NotFound();

            if (dto == null || dto.Quantity <= 0)
                return BadRequest("Invalid quantity");

            item.Stock += dto.Quantity;

            return Ok(item);
        }
    } 
}
