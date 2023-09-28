using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Utills
{
    public class OPSHash
    {
        public static string GetFileChecksum(string fileName)
        {
            var checksum = GetFileChecksumBinary(fileName);
            return Convert.ToBase64String(checksum);
        }

        public static string GetFileChecksum(Stream fileStream)
        {
            var checksum = GetFileChecksumBinary(fileStream);
            return Convert.ToBase64String(checksum);
        }

        public static byte[] GetFileChecksumBinary(string fileName)
        {
            using (FileStream stream = File.OpenRead(fileName))
            {
                return GetFileChecksumBinary(stream);
            }
        }

        public static byte[] GetFileChecksumBinary(Stream fileStream)
        {
            var sha = SHA1CryptoServiceProvider.Create();
            return sha.ComputeHash(fileStream);
        }

        public static byte[] CalculateHash(string value)
        {
            var sha = SHA1CryptoServiceProvider.Create();
            ASCIIEncoding encoding = new ASCIIEncoding();
            var salted = AddSalt(value);
            byte[] stream = sha.ComputeHash(encoding.GetBytes(salted));
            return stream;
        }

        public static bool CheckHashValue(string value, byte[] hash)
        {
            bool bEqual = false;
            byte[] valueBytes = CalculateHash(value);
            if (valueBytes.Length == hash.Length)
            {
                int i = 0;
                while ((i < valueBytes.Length) && (valueBytes[i] == hash[i]))
                {
                    i += 1;
                }
                if (i == valueBytes.Length)
                {
                    bEqual = true;
                }
            }
            return bEqual;
        }

        public static bool CheckHashValue(string value, string toComapre)
        {
            byte[] toCompareBytes = CalculateHash(value);
            return CheckHashValue(value, toCompareBytes);
        }

        private static string AddSalt(string value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;
            var chars = value.ToCharArray();
            var builder = new StringBuilder(value.Length * 2 + 1);
            builder.Append('#');
            foreach (var ch in chars)
            {
                builder.Append(ch);
                builder.Append('^');
            }
            return builder.ToString();
        }

        public static string Encrypt(byte[] toEncrypt)
        {
            if (toEncrypt != null)
                //return Convert.ToBase64String(toEncrypt);
                return BitConverter.ToString(toEncrypt)
                        .Replace("-", string.Empty);
            else
                return string.Empty;
        }

        public static byte[] GetShaHash(string input)
        {
            using (FileStream stream = File.OpenRead(input))
            {
                using (SHA1Managed sha = new SHA1Managed())
                {
                    return sha.ComputeHash(stream);
                    //return BitConverter.ToString(checksum)
                    //    .Replace("-", string.Empty);
                }
            }
        }

        public static byte[] GetSha256Hash(string input)
        {
            using (FileStream stream = File.OpenRead(input))
            {
                using (SHA256Managed sha = new SHA256Managed())
                {
                    return sha.ComputeHash(stream);
                    //return BitConverter.ToString(checksum)
                    //    .Replace("-", string.Empty);
                }
            }
        }

        public static string GetSha1HashString(string input)
        {
            SHA1 shaHash = SHA1CryptoServiceProvider.Create();
            // Convert the input string to a byte array and compute the hash.
            byte[] data = shaHash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        public static byte[] GetSha2_512Hash(string input)
        {
            using (FileStream stream = File.OpenRead(input))
            {
                using (SHA512Managed sha = new SHA512Managed())
                {
                    return sha.ComputeHash(stream);
                    //return BitConverter.ToString(checksum)
                    //    .Replace("-", string.Empty);
                }
            }
        }

        public static byte[] GetSha2_512Hash(byte[] input)
        {
            using (SHA512Managed sha = new SHA512Managed())
            {
                return sha.ComputeHash(input);
                //return BitConverter.ToString(checksum)
                //    .Replace("-", string.Empty);
            }
        }

        public static byte[] GetFileChecksumBinarySHA2_512(Stream fileStream)
        {
            var sha = SHA512CryptoServiceProvider.Create();
            return sha.ComputeHash(fileStream);
        }

        public static byte[] GetFileChecksumBinarySHA2_256(Stream fileStream)
        {
            var sha = SHA256CryptoServiceProvider.Create();
            return sha.ComputeHash(fileStream);
        }

        public static byte[] GenerateRSAKey()
        {
            using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(2048))
            {
                return OPSCryptography.Instance.EncryptBinary(Convert.ToBase64String(rsa.ExportCspBlob(true)));
            }
        }
    }
}
