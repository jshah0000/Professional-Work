//a sample query to count to total number of documents in climates
/*/ Find all cities that are located in regions in the eastern hemisphere that have a per
capita gross domestic product less than 20000 US dollars. Your result should be an array
consisting of documents in the following format:
{
city: city_name,
region: region_name,
per_capita_gdp: per_capita_gdp
}
where city name is the name of the city;
region name is the name of the region the city is in; and
per capita gdp is the per capita gdp of the region the city is in.
Your results must be sorted by city name in ascending order./*/
var res = db.coords.aggregate([
    {$match:{longitude:{$gt:0}}},
    {$lookup:{
        from:"climates",
        localField:"city",
        foreignField:"city",
        as:"from_climate"
    }},
    {$unwind:"$from_climate"},
    {$lookup:{
        from:"gdps",
        localField:"from_climate.region",
        foreignField:"region",
        as:"from_gdps"
    }},
    {$unwind:"$from_gdps"},
    {$match:{"from_gdps.per_capita_gdp":{$lt:20000}}},
    {$project:{
        _id: 0,
        city:"$city",
        region:"$from_gdps.region",
        per_capita_gdp:"$from_gdps.per_capita_gdp"
    }},
    {$sort:{"city":1}}
])
