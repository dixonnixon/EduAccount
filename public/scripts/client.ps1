$ROleName = "Role";
$Cab = "9"
$Floor = "9"



$path = "D:\scripts\Server_Inventory\"
$name = $((Get-Date).ToString('MM-dd-yyyy')) + ".csv"

$outreport =  $path + $name

#if (!(Test-Path $outreport))
#{
   New-Item -path $path -name $name  -type "file"  -Force
#} 



$CPUInfo = Get-WmiObject Win32_Processor

$OSInfo = Get-WmiObject Win32_OperatingSystem

$PhysicalMemory = Get-WmiObject CIM_PhysicalMemory | Measure-Object -Property capacity -Sum | % {[math]::round(($_.sum / 1GB),2)}

$Network = Get-WmiObject Win32_NetworkAdapterConfiguration -Filter 'ipenabled = true'

$localadmins = Get-WmiObject  win32_group 
$Network
$Network.PSObject.Properties  | ForEach-Object {
      $_.IPAddress.Properties | ForEach-Object {$_ } 

}

$params = @{
  "ComputerName" = "."
  "Class" = "Win32_NetworkAdapterConfiguration"
  "Filter" = "IPEnabled=TRUE"
}
$netConfigs = Get-WMIObject @params
foreach ( $netConfig in $netConfigs ) {
  $netConfig.ServiceName
  for ( $i = 0; $i -lt $netConfig.IPAddress.Count; $i++ ) {
    if ( $netConfig.IPAddress[$i] -match '(\d{1,3}\.){3}\d{1,3}' ) {
      $ipString = $netConfig.IPAddress[$i]
      $ip = [IPAddress] $ipString
      $maskString = $netConfig.IPSubnet[$i]
      $mask = [IPAddress] $maskString
      $netID = [IPAddress] ($ip.Address -band $mask.Address)
      "IP address: {0}" -f $ip.IPAddressToString
      "Subnet mask: {0}" -f $mask.IPAddressToString
      "Network ID: {0}" -f $netID.IPAddressToString
    }
  }
}

$infoObject = New-Object PSObject

$infoObject

Add-Member -inputObject $infoObject -memberType NoteProperty -name ClientName -value $CPUInfo.SystemName 
Add-Member -inputObject $infoObject -memberType NoteProperty -name CPU_Name -value $CPUInfo.Name 
Add-Member -inputObject $infoObject -memberType NoteProperty -name TotalMemory_GB -value $PhysicalMemory
Add-Member -inputObject $infoObject -memberType NoteProperty -name OS_Name -value $OSInfo.Caption 
Add-Member -inputObject $infoObject -memberType NoteProperty -name OS_Version -value $OSInfo.Version 
Add-Member -inputObject $infoObject -memberType NoteProperty -name IP_Address -value $Network.IPAddress 
Add-Member -inputObject $infoObject -memberType NoteProperty -name LocalAdmins -value $localadmins.Caption 




$infoObject |  
  Select-Object -Property ClientName, 
        CPU_Name, 
        TotalMemory_GB, OS_Name, OS_Version, IP_Address, LocalAdmins | Export-Csv -path $outreport -NoTypeInformation