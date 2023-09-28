using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Utills
{
    public class OPSCryptography
    {
        private static OPSCryptography _instance;
        private static readonly ReaderWriterLockSlim _lock = new ReaderWriterLockSlim();
        private byte[] keyArray;

        public static OPSCryptography Instance
        {
            get
            {
                return _instance;
            }
        }

        private OPSCryptography(string key)
        {
            var sha = SHA1CryptoServiceProvider.Create();
            var hash = sha.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
            sha.Clear();
            keyArray = new byte[24];
            Array.Copy(hash, 0, keyArray, 0, 20);
        }

        public static void Initialize(string key)
        {
            try
            {
                _lock.EnterWriteLock();
                if (_instance == null)
                {
                    _instance = new OPSCryptography(key);
                }
            }
            finally
            {
                _lock.ExitWriteLock();
            }
        }

        /// <summary>
        /// Encrypt a string using dual encryption method.
        /// </summary>
        /// <param name="toEncrypt">string to be encrypted</param>
        /// <returns></returns>
        public string Encrypt(string toEncrypt)
        {
            return Convert.ToBase64String(EncryptBinary(toEncrypt));
        }

        public byte[] EncryptBinary(string toEncrypt)
        {
            byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateEncryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            tdes.Clear();
            return resultArray;
        }

        /// <summary>
        /// DeCrypts a transformed array using dual encryption method. Return a DeCrypted clear string
        /// </summary>
        /// <param name="transformedArray">byte array from database</param>
        /// <returns></returns>
        public string Decrypt(string encrypted)
        {
            byte[] toEncryptArray = Convert.FromBase64String(encrypted);
            return Decrypt(toEncryptArray);
        }

        public string Decrypt(byte[] encrypted)
        {
            byte[] toEncryptArray = encrypted;


            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            tdes.Clear();
            return UTF8Encoding.UTF8.GetString(resultArray);
        }
    }
}
