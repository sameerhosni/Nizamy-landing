export function ticketScreenshots(input: unknown) {
  if(input===undefined)return [];
  if(!Array.isArray(input)||input.length>3)throw new Error("Maximum three screenshots");
  return input.map((file,i)=>{
    if(!file || typeof file.data!=="string" || file.data.length>2800000 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(file.data))throw new Error("Invalid screenshot");
    const content=Buffer.from(file.data,"base64");
    if(content.length===0||content.length>2*1024*1024)throw new Error("Screenshot too large");
    const png=content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const jpeg=content[0]===255&&content[1]===216&&content[2]===255;
    const webp=content.toString("ascii",0,4)==="RIFF"&&content.toString("ascii",8,12)==="WEBP";
    const type=png?"image/png":jpeg?"image/jpeg":webp?"image/webp":null;
    if(!type||file.type!==type)throw new Error("Only PNG, JPEG and WebP supported");
    return {filename:`screenshot-${i+1}.${png?"png":jpeg?"jpg":"webp"}`,content,contentType:type};
  });
}