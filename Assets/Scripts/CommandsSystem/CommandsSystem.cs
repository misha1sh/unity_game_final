using System;
using System.IO;
using System.Linq;
using System.Text;
using Character;
using Character.Guns;
using CommandsSystem.Commands;
using JsonRequest;

namespace CommandsSystem {
    
    /// <summary>
    ///     ����� ��� ������������ � �������������� ������
    /// </summary>
    public class CommandsSystem {
        /// <summary>
        ///     �������� �������� ������� � �������� ��� � ���������� � stream.
        ///     ������ ����� ���������� �������������
        /// </summary>
        /// <param name="command">�������</param>
        /// <param name="stream">�����, � ������� ����� �������� �������</param>
        /// <typeparam name="T">��� �������</typeparam>
        private void EncodeCommand<T>(T command, Stream stream) where T : ICommand {
/*BEGIN2*/
            if (command is AddOrChangeInstance addorchangeinstance) {
                stream.WriteByte((byte)0);
                var buf = addorchangeinstance.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is AddPlayerToGame addplayertogame) {
                stream.WriteByte((byte)1);
                var buf = addplayertogame.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is ApplyForceCommand applyforcecommand) {
                stream.WriteByte((byte)2);
                var buf = applyforcecommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is ChangeHPCommand changehpcommand) {
                stream.WriteByte((byte)3);
                var buf = changehpcommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is ChangePlayerProperty changeplayerproperty) {
                stream.WriteByte((byte)4);
                var buf = changeplayerproperty.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is ChangePlayerScore changeplayerscore) {
                stream.WriteByte((byte)5);
                var buf = changeplayerscore.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is CreateChatMessageCommand createchatmessagecommand) {
                stream.WriteByte((byte)6);
                var buf = createchatmessagecommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is DrawPositionTracerCommand drawpositiontracercommand) {
                stream.WriteByte((byte)7);
                var buf = drawpositiontracercommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is DrawTargetedTracerCommand drawtargetedtracercommand) {
                stream.WriteByte((byte)8);
                var buf = drawtargetedtracercommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is ExplodeBombCommand explodebombcommand) {
                stream.WriteByte((byte)9);
                var buf = explodebombcommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is PickCoinCommand pickcoincommand) {
                stream.WriteByte((byte)10);
                var buf = pickcoincommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is PickUpGunCommand pickupguncommand) {
                stream.WriteByte((byte)11);
                var buf = pickupguncommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is PlayerPushCommand playerpushcommand) {
                stream.WriteByte((byte)12);
                var buf = playerpushcommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SetAfterShowResultsCommand setaftershowresultscommand) {
                stream.WriteByte((byte)13);
                var buf = setaftershowresultscommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SetGameMode setgamemode) {
                stream.WriteByte((byte)14);
                var buf = setgamemode.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SetPlatformStateCommand setplatformstatecommand) {
                stream.WriteByte((byte)15);
                var buf = setplatformstatecommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SpawnParabolaFlyingCommand spawnparabolaflyingcommand) {
                stream.WriteByte((byte)16);
                var buf = spawnparabolaflyingcommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SpawnPlayerCommand spawnplayercommand) {
                stream.WriteByte((byte)17);
                var buf = spawnplayercommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SpawnPrefabCommand spawnprefabcommand) {
                stream.WriteByte((byte)18);
                var buf = spawnprefabcommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is StartGameCommand startgamecommand) {
                stream.WriteByte((byte)19);
                var buf = startgamecommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is TakeOwnCommand takeowncommand) {
                stream.WriteByte((byte)20);
                var buf = takeowncommand.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is Pistol pistol) {
                stream.WriteByte((byte)21);
                var buf = pistol.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is ShotGun shotgun) {
                stream.WriteByte((byte)22);
                var buf = shotgun.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is SemiautoGun semiautogun) {
                stream.WriteByte((byte)23);
                var buf = semiautogun.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
            if (command is BombGun bombgun) {
                stream.WriteByte((byte)24);
                var buf = bombgun.Serialize();
                stream.Write(buf, 0, buf.Length);
            } else
/*END2*/
            {
                throw new ArgumentException("Unknown command: " + command.GetType());
            }
                       
            
        }
        
        /// <summary>
        ///     MemoryStream ��� ����������� ������������� (����� ��� ���������� �������� �� ������� ������)
        /// </summary>
        private static MemoryStream _stream = new MemoryStream();
        /// <summary>
        ///     BinaryWriter ��� ����������� ������������� (����� ��� ���������� �������� �� ������� ������)
        /// </summary>
        private static BinaryWriter _writer = new BinaryWriter(_stream);

        /// <summary>
        ///     ������� ������ ��� ������ ������ �� ������
        /// </summary>
        private void ResetWriteStreams() {
            _stream.SetLength(0);
            _writer.Seek(0, SeekOrigin.Begin);
        }
        
        /// <summary>
        ///     �������� ������� �������
        /// </summary>
        /// <param name="command">�������</param>
        /// <param name="room">�������, � ������� ����� ��������� �������</param>
        /// <param name="flags">����� ��������</param>
        /// <typeparam name="T">��� �������</typeparam>
        /// <returns>�������������� � �������� ��� �������</returns>
        public byte[] EncodeSimpleCommand<T>(T command, int room, MessageFlags flags) where T : ICommand {
            ResetWriteStreams();
            _writer.Write((byte) MessageType.SimpleMessage); 
            _writer.Write((int)room);
            _writer.Write((byte)flags);
            
            EncodeCommand(command, _stream);
            return _stream.ToArray();
        }

        /// <summary>
        ///     �������� ���������� �������
        /// </summary>
        /// <param name="command">�������</param>
        /// <param name="room">�������, � ������� ����� ��������� �������</param>
        /// <param name="code1">������ �������� ����������� ����</param>
        /// <param name="code2">������ �������� ����������� ����</param>
        /// <param name="flags">����� ��������</param>
        /// <typeparam name="T">��� �������</typeparam>
        /// <returns>�������������� � �������� ��� �������</returns>
        public byte[] EncodeUniqCommand<T>(T command, int room, int code1, int code2, MessageFlags flags) where T : ICommand {
            ResetWriteStreams();
            _writer.Write((byte) MessageType.UniqMessage);
            _writer.Write(room);
            _writer.Write((byte)flags);
            _writer.Write(code1);
            _writer.Write(code2);
            
            EncodeCommand(command, _stream);
            return _stream.ToArray();
        }

        /// <summary>
        ///     �������� ������� ������� ��������� � �������
        /// </summary>
        /// <param name="room">������� �� ������� ������������� ���������</param>
        /// <param name="firstIndex">������ ������� ���������, ������� ����� ���������</param>
        /// <param name="lastIndex">������ ���������� ���������, ������� ����� ���������</param>
        /// <param name="flags">�����</param>
        /// <returns>�������������� � �������� ��� �������</returns>
        public byte[] EncodeAskMessage(int room, int firstIndex, int lastIndex, MessageFlags flags) {
            ResetWriteStreams();
            
            _writer.Write((byte) MessageType.AskMessage);
            _writer.Write(room);
            _writer.Write((byte)flags);
            _writer.Write(firstIndex);
            _writer.Write(lastIndex);

            return _stream.ToArray();
        }

        /// <summary>
        ///     �������� ������� ������������� � ������� �������
        /// </summary>
        /// <param name="room">�������, � ������� ����� ��������������</param>
        /// <param name="flags">�����</param>
        /// <returns>�������������� � �������� ��� �������</returns>
        public byte[] EncodeJoinGameRoomMessage(int room, MessageFlags flags) {
            ResetWriteStreams();
            
            _writer.Write((byte) MessageType.JoinGameRoom);
            _writer.Write(room);
            _writer.Write((byte)flags);

            return _stream.ToArray();
        }

        /// <summary>
        ///     �������� ������� ��������� ������� �������
        /// </summary>
        /// <param name="room">�������, ������� ����� ��������</param>
        /// <param name="flags">�����</param>
        /// <returns>�������������� � �������� ��� �������</returns>
        public byte[] EncodeLeaveGameRoomMessage(int room, MessageFlags flags) {
            ResetWriteStreams();
            
            _writer.Write((byte) MessageType.LeaveGameRoom);
            _writer.Write(room);
            _writer.Write((byte)flags);
            
            return _stream.ToArray();
        }

        /// <summary>
        ///     �������� JSON-��������� �� ������
        /// </summary>
        /// <param name="json">JSON ������</param>
        /// <param name="room">�������, � ������� ����� ��������� ���������</param>
        /// <param name="flags">�����</param>
        /// <returns>�������������� � �������� ��� ���������</returns>
        public byte[] EncodeJsonMessage(string json, int room, MessageFlags flags) {
            ResetWriteStreams();
            
            _writer.Write((byte)MessageType.JSON);
            _writer.Write(room);
            _writer.Write((byte)flags);
            var bytes = Encoding.UTF8.GetBytes(json);
            _writer.Write(bytes);
                
            return _stream.ToArray();
        }
        
        /// <summary>
        ///     ���������� ������� � �������
        ///     � ������ ������ ������������ �������������
        /// </summary>
        /// <param name="array">�������������� �������</param>
        /// <param name="num">����� �������</param>
        /// <param name="room">�������, � ������� ������ �������</param>
        /// <returns>�������������� �������</returns>
        public ICommand DecodeCommand(byte[] array, out int num, out int room) {
            var stream = new MemoryStream(array);
            
            var reader = new BinaryReader(stream);
            
            num = reader.ReadInt32();
            room = reader.ReadInt32();
            
            byte commandType = (byte) stream.ReadByte();
            byte[] arr = array.Skip(9).ToArray(); // TODO: fix performance
            switch (commandType) {
/*BEGIN1*/
             case 0:
                     return AddOrChangeInstance.Deserialize(arr);
                 case 1:
                     return AddPlayerToGame.Deserialize(arr);
                 case 2:
                     return ApplyForceCommand.Deserialize(arr);
                 case 3:
                     return ChangeHPCommand.Deserialize(arr);
                 case 4:
                     return ChangePlayerProperty.Deserialize(arr);
                 case 5:
                     return ChangePlayerScore.Deserialize(arr);
                 case 6:
                     return CreateChatMessageCommand.Deserialize(arr);
                 case 7:
                     return DrawPositionTracerCommand.Deserialize(arr);
                 case 8:
                     return DrawTargetedTracerCommand.Deserialize(arr);
                 case 9:
                     return ExplodeBombCommand.Deserialize(arr);
                 case 10:
                     return PickCoinCommand.Deserialize(arr);
                 case 11:
                     return PickUpGunCommand.Deserialize(arr);
                 case 12:
                     return PlayerPushCommand.Deserialize(arr);
                 case 13:
                     return SetAfterShowResultsCommand.Deserialize(arr);
                 case 14:
                     return SetGameMode.Deserialize(arr);
                 case 15:
                     return SetPlatformStateCommand.Deserialize(arr);
                 case 16:
                     return SpawnParabolaFlyingCommand.Deserialize(arr);
                 case 17:
                     return SpawnPlayerCommand.Deserialize(arr);
                 case 18:
                     return SpawnPrefabCommand.Deserialize(arr);
                 case 19:
                     return StartGameCommand.Deserialize(arr);
                 case 20:
                     return TakeOwnCommand.Deserialize(arr);
                 case 21:
                     return Pistol.Deserialize(arr);
                 case 22:
                     return ShotGun.Deserialize(arr);
                 case 23:
                     return SemiautoGun.Deserialize(arr);
                 case 24:
                     return BombGun.Deserialize(arr);
    /*END1*/
                 case 255:
                    return null;
                 case 254:
                     return Response.Deserialize(arr);
                 default:
                     throw new ArgumentOutOfRangeException("Command type is " + commandType);
             }
        }
    }
    
}

