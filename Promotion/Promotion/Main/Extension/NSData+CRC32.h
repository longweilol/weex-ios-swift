//
//  NSData+CRC32.h
//  CRC32_iOS
//

#import <Foundation/Foundation.h>
#import <zlib.h>

@interface NSData (CRC32)

-(int32_t)crc_32;

-(uLong)getCRC32;

@end
