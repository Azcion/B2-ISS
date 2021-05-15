cd $1

for file in *
do
  end=$(echo $file | awk -F"-" '{print $NF}')
  elen=${#end}
  flen=${#file}
  outlen=$((flen - elen - 1 - 7))
  name=$(echo $1_${file:7:outlen}.jpg)
  [[ $file == "pexels-"* ]] && mv "$file" "$name"
done
