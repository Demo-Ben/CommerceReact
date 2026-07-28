var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// CORS for React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        // "http://localhost:63387" for Angular web client
        policy.WithOrigins("http://localhost:52136", "http://localhost:49978", "http://localhost:60695","http://localhost:63387")
              .AllowAnyHeader()
              .AllowAnyMethod();

    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowReact");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
