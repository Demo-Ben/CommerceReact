var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", policy =>
//        policy.AllowAnyOrigin()
//              .AllowAnyMethod()
//              .AllowAnyHeader());
//});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        // "http://localhost:63387" for Angular web client
        policy.WithOrigins("http://localhost:52136", "http://localhost:49978", "http://localhost:63387")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowReact");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
