namespace DiffPack.Models
{
    public class PackageFile
    {
        public string FileName { get; set; }
        public string Version1 { get; set; }
        public string Version2 { get; set; }
    }

    public class PackageFileDiff
    {
        public string FileName { get; set; }
        public string Diff { get; set; }
    }

}